// routes/initDatabase.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../models/Product');

router.get('/init', async (req, res) => {
    try {
        // Fetch data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

        // Extract relevant data from the response
        const productsData = response.data;

        // Initialize the database with seed data
        await Product.insertMany(productsData);

        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Failed to initialize database' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const { search, page = 1, perPage = 10,month = 3 } = req.query;

        // Construct the query based on the search parameters
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: parseFloat(search) || null },
               
            ];
        }
        if (month) {
            query.$expr = { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] };
        }


        // Count total records matching the query
        const totalCount = await Product.countDocuments(query);

        // Fetch products based on pagination
        const products = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage))
            .sort({ dateOfSale: -1 }); // Sorting by dateOfSale in descending order

        res.status(200).json({
            totalCount,
            currentPage: page,
            perPage,
            totalPages: Math.ceil(totalCount / perPage),
            products
        });
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: 'Failed to list products' });
    }
});

router.get('/statistics', async (req, res) => {
    try {
        // Parse query parameter for the selected month
        const { month = 3 } = req.query;

        if (parseInt(month) > 12) {
            return res.status(400).json('Invalid month. Month must be between 1 and 12.');
        }

        // Query the database to get statistics
        const totalSaleAmount = await Product.aggregate([
            {
                $addFields: {
                    saleMonth: { $month: '$dateOfSale' } // Extract month from dateOfSale
                }
            },
            { $match: { saleMonth: parseInt(month), sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Product.countDocuments({
            $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
            sold: true
        });

        const totalUnsoldItems = await Product.countDocuments({
            $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
            sold: false
        });

        // Return response
        res.json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total.toFixed(2)  : 0,
            totalSoldItems,
            totalUnsoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/bar-chart', async (req, res) => {
    try {
        // Parse query parameter for the selected month
        const { month = 3 } = req.query;

        if (parseInt(month) > 12) {
            return res.status(400).json('Invalid month. Month must be between 1 and 12.');
        }

        // Define price ranges
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        // Query the database to get the number of items in each price range
        const barChartData = await Promise.all(priceRanges.map(async range => {
            const count = await Product.countDocuments({
                price: { $gte: range.min, $lte: range.max },
                $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
            });
            return {
                range: `${range.min} - ${range.max === Infinity ? 'above' : range.max}`,
                count
            };
        }));

        // Return response
        res.json(barChartData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/pie-chart', async (req, res) => {
    try {
        // Parse query parameter for the selected month
        const { month = 3 } = req.query;

        if (parseInt(month) > 12) {
            return res.status(400).json('Invalid month. Month must be between 1 and 12.');
        }

        // Query the database to get the number of items in each category
        const pieChartData = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Return response
        res.json(pieChartData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const apiUrls = [
    `http://localhost:${process.env.PORT}/roxiler/statistics`,
    `http://localhost:${process.env.PORT}/roxiler/bar-chart`,
    `http://localhost:${process.env.PORT}/roxiler/pie-chart`
  ];
  

router.get('/combined-data', async (req, res) => {
    try {
      // Array to store promises for fetching data from each API
      const apiRequests = apiUrls.map(url => axios.get(url));
  
      // Execute all API requests concurrently
      const responses = await Promise.all(apiRequests);
  
      // Extract data from each response
      const combinedData = responses.map(response => response.data);
  
      // Combine the data from all APIs into a single response
      const finalResponse = {
        combinedData
      };
  
      // Send the final combined JSON response
      res.json(finalResponse);
    } catch (error) {
      console.error('Error fetching combined data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;

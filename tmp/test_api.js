const axios = require('axios');

async function testFilters() {
    try {
        const res = await axios.get('http://localhost:2004/api/products/filters?category=electricals');
        console.log('SUCCESS:', res.data);
    } catch (err) {
        console.error('ERROR status:', err.response?.status);
        console.error('ERROR data:', err.response?.data);
    }
}

testFilters();

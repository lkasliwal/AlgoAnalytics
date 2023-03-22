// const axios = require('axios');
// const apiEndpoint = process.env.SELECT_PART_API_ENDPOINT;
// const fullUrl = `${apiEndpoint}/part5`;
// const part_ok_not_ok = "ok"

// const params = {
//     image: ""
// };

// Router.post('/api/operator/selectpart', async (req, res) => {
//     console.log("inside select part django-api", req.body.part_name);
//     console.log({fullUrl});
//     axios.get(fullUrl)
//     .then(response => {
//         part_ok_not_ok = response.data
//         console.log("response.data = ", response.data);
//     })
//     .catch(error => {
//         console.log(error);
//     });
// })

// module.exports = part_ok_not_ok

// async function fetchData() {
//     try {
//         const response = await axios.get(apiEndpoint);
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// module.exports = { fetchData };
const axios = require('axios');
const apiEndpoint = process.env.ML_API_ENDPOINT;
const part_ok_not_ok="ok"

const params = {
    image:""
  };

axios.get(apiEndpoint,{params})
  .then(response => {
    part_ok_not_ok=response.data
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
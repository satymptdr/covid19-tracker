fetch('http://localhost:3000/send_post_data').then(() => {
    console.log('response returned')
}).catch((error) => {
    console.log('error in routing')
    console.log(error)
});
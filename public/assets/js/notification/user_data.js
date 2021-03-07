var user_data;

fetch('https://ipapi.co/json/').then((response) => {
    response.json().then((data) => {
        user_data = { 
            state: data.region,
            country: data.country_name,
        };
        user_data['timestamp'] = new Date(Date.now()).toLocaleString();

        fetch('http://localhost:3000/abhay/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user_data)
        }).then(() => {
            console.log('response returned')
        }).catch((error) => {
            console.log('error in routing')
            console.log(error)
        });
    })
}).catch((error) => {
    console.log('error in fetching client data')
    console.log(error)
});
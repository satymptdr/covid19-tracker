var user_data;

fetch('https://ipapi.co/json/').then((response) => {
    response.json().then((data) => {
        user_data = { 
            ip: data.ip,
            city: data.city,
            state: data.region,
            country: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude,
            telecome: data.org,
            postal: data.postal
        };
        user_data['timestamp'] = new Date(Date.now()).toLocaleString();

        console.log(user_data);
        
        fetch('http://localhost:3000/post_data/', {
            mode: 'no-cors',
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
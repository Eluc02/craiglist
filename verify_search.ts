

async function verifySearch() {
    try {
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: 'bike' }),
        });

        console.log('Status:', response.status);
        const listingsHeader = response.headers.get('x-listings-data');
        if (listingsHeader) {
            const listings = JSON.parse(listingsHeader);
            console.log('Listings found:', listings.length);
            if (listings.length > 0) {
                console.log('First listing similarity:', listings[0].similarity);
                console.log('First listing title:', listings[0].title);
            } else {
                console.log('No listings found.');
            }
        } else {
            console.log('No x-listings-data header found.');
        }
    } catch (error) {
        console.error('Error verifying search:', error);
    }
}

verifySearch();

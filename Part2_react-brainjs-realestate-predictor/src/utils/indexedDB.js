const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RealEstateDB', 8); // Incremented version to ensure object store creation

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('properties')) {
                db.createObjectStore('properties', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Database error: ' + event.target.errorCode + ' - ' + event.target.error);
        };
    });
};

const addProperty = (property) => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(['properties'], 'readwrite');
            const store = transaction.objectStore('properties');
            const request = store.add(property);

            request.onsuccess = () => {
                resolve('Property added to the database');
            };

            request.onerror = (event) => {
                reject('Error adding property: ' + event.target.errorCode);
            };
        });
    });
};

const getProperties = () => {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const transaction = db.transaction(['properties'], 'readonly');
            const store = transaction.objectStore('properties');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error retrieving properties: ' + event.target.errorCode);
            };
        });
    });
};

export { addProperty, getProperties };

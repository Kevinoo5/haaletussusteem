const mysql = require('mysql');
const express = require('express');
const app = express();

const port = 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Connect to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'haaletus'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

app.post('/submit', (req, res) => {
    // Process form submission
    const { firstName, lastName, decision } = req.body;
    const decisionValue = decision === 'poolt' ? 1 : 0;

    // Check if the number of entries exceeds the limit
    const countSql = 'SELECT COUNT(*) AS entryCount FROM haaletus';
    connection.query(countSql, (err, result) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.status(500).send('Error retrieving data');
        } else {
            const entryCount = result[0].entryCount;
            if (entryCount >= 11) {
                res.status(403).send('Database entry limit reached');
            } else {
                // Check if the combination of firstName and lastName already exists
                const selectSql = 'SELECT * FROM haaletus WHERE eesnimi = ? AND perenimi = ?';
                connection.query(selectSql, [firstName, lastName], (err, result) => {
                    if (err) {
                        console.error('Error retrieving data:', err);
                        res.status(500).send('Error retrieving data');
                    } else {
                        if (result.length > 0) {
                            // If the record exists, update the otsus value
                            const updateSql = 'UPDATE haaletus SET otsus = ? WHERE eesnimi = ? AND perenimi = ?';
                            connection.query(updateSql, [decisionValue, firstName, lastName], (err, result) => {
                                if (err) {
                                    console.error('Error updating data:', err);
                                    res.status(500).send('Error updating data');
                                } else {
                                    console.log('Data updated successfully');
                                    res.redirect('/'); // Redirect to the root URL after successful form submission
                                }
                            });
                        } else {
                            // If the record doesn't exist, insert a new record
                            const insertSql = 'INSERT INTO haaletus (eesnimi, perenimi, otsus) VALUES (?, ?, ?)';
                            connection.query(insertSql, [firstName, lastName, decisionValue], (err, result) => {
                                if (err) {
                                    console.error('Error inserting data:', err);
                                    res.status(500).send('Error inserting data');
                                } else {
                                    console.log('Data inserted successfully');
                                    res.redirect('/'); // Redirect to the root URL after successful form submission
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

app.get('/results', (req, res) => {
    // Retrieve results from the database
    const sql = 'SELECT eesnimi, perenimi, otsus FROM haaletus';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

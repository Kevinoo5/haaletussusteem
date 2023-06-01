

function updateTableWithData(data) {
    const tableBody = document.getElementById('results-table');



    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${entry.eesnimi}</td>
      <td>${entry.perenimi}</td>
      <td>${entry.otsus}</td>
    `;
        tableBody.appendChild(row);
    });
}

function startTimer() {
    let interval = 5 * 60 * 1000; // Timer interval in milliseconds (5 minutes)

    function resetTimer() {
        localStorage.startTime = +new Date();
    }

    if (!localStorage.startTime) {
        resetTimer(); // Set the start time if it hasn't been set
    }

    let timerInterval = setInterval(() => {
        let elapsedTime = new Date() - localStorage.startTime;
        let remaining = interval - elapsedTime;

        if (remaining >= 0) {
            let minutes = Math.floor(remaining / 1000 / 60);
            let seconds = Math.floor((remaining / 1000) % 60);

            // Format the minutes and seconds to have leading zeros if needed
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

            document.getElementById('timer').innerText = formattedMinutes + ':' + formattedSeconds;
            document.getElementById('submit-button').disabled = false;
            document.getElementById('start-button').disabled = true;
        } else {
            clearInterval(timerInterval); // Clear the interval to stop the timer
            document.getElementById('timer').innerText = 'Hääletamine on lõppenud';
            document.getElementById('start-button').disabled = false;
        }
    }, 1000);
}




document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Retrieve results from the server
    fetch('/results')
        .then(response => response.json())
        .then(data => {
            console.log('Data retrieved:', data);

            // Update the table with the retrieved data
            updateTableWithData(data);
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });
});

document.getElementById('start-button').addEventListener('click', function() {
    startTimer()
    document.getElementById('start-button').disabled = true;
});

document.getElementById('submit-button').addEventListener('click', function() {
    // Perform the form submission as before
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const decision = document.getElementById('decision').value;

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, decision })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .then(data => {
            // Check if the timer has started on the server
            if (data.timerStarted) {
                startTimer();
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
});


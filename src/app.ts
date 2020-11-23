


const ca = new CellularAutomat2D(80, 60, 1)

const toggleButton = document.getElementById('toggle-button')

function ecStop() {
    ca.stop()
    toggleButton.textContent = "Start"
}

function ecStart() {
    ca.start()
    toggleButton.textContent = "Stop"
}


function ecToggle() {
    if(ca.isRunning()) {
        ecStop()
    }
    else {
        ecStart()
    }
}
toggleButton.addEventListener('click', ecToggle)

const startPatternArea = <HTMLTextAreaElement> document.getElementById('start-pattern')
function ecReset() {
    ecStop()
    ca.reset(startPatternArea.value)
}
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', ecReset)

ecReset()
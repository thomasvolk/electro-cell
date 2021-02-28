


const ca = new CellularAutomat2D(700, 700, 1)

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
const applyButton = document.getElementById('apply-button')
applyButton.addEventListener('click', ecReset)

function ecRandom() {
    ecStop()
    ca.random()
    ca.draw()
}
const randomButton = document.getElementById('random-button')
randomButton.addEventListener('click', ecRandom)

ecReset()
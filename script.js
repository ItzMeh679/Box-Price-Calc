// Function to calculate sheet size
function calculateSheetSize() {
  const length = parseFloat(document.getElementById('length').value);
  const width = parseFloat(document.getElementById('width').value);
  const height = parseFloat(document.getElementById('height').value);
  const boxType = document.getElementById('boxType').value;

  let x, y, sheetSize;

  if (boxType === 'Universal') {
    x = width + height + 1;
    y = Math.ceil((length + width) * 2 + 1.5);
    sheetSize = x * y;
  } else if (boxType === 'TwoSideFlap') {
    x = width * 2 + height + 2;
    y = Math.ceil((length + width) * 2 + 1.5);
    sheetSize = x * y;
  } else if (boxType === 'DownSideInterlock') {
    x = width + (0.85 * width) + height + 1;
    y = Math.ceil((length + width) * 2 + 1.5);
    sheetSize = x * y;
  }

  document.getElementById('sheetSizeResult').innerHTML = `Sheet Size: ${sheetSize}`;
}

// Function to update options for BF (Burst Factor)
const updateBFOptions = () => {
  const typeSelects = document.querySelectorAll('.type');
  const gsmSelects = document.querySelectorAll('.gsm, .floatGsm');

  typeSelects.forEach((typeSelect, index) => {
    const gsmSelect = gsmSelects[index];
    const bfSelect = typeSelect.nextElementSibling.nextElementSibling;

    const updateBF = () => {
      const type = typeSelect.value;
      const gsm = gsmSelect.value;
      bfSelect.innerHTML = '';

      if (gsmSelect.classList.contains('gsm')) {
        if (type === 'Natural') {
          if (gsm == '100' || gsm == '120' || gsm == '140' || gsm == '150' || gsm == '180' || gsm == '210') {
            bfSelect.innerHTML = `<option value="16">16 BF</option>`;
          }
        } else if (type === 'Golden') {
          if (gsm == '120') {
            bfSelect.innerHTML = `<option value="18">18 BF (Golden)</option>`;
          } else if (gsm == '140' || gsm == '210') {
            bfSelect.innerHTML = `<option value="16">16 BF (Golden)</option>`;
          } else if (gsm == '150' || gsm == '180') {
            bfSelect.innerHTML = `<option value="22">22 BF (Golden)</option>`;
          } else if (gsm == '225' || gsm == '270') {
            bfSelect.innerHTML = `<option value="22">22 BF (Golden)</option>`;
          }
        }
      } else if (gsmSelect.classList.contains('floatGsm')) {
        if (type === 'Natural') {
          if (gsm == '150' || gsm == '180' || gsm == '210') {
            bfSelect.innerHTML = `<option value="16">16 BF</option>`;
          }
        } else if (type === 'Golden') {
          if (gsm == '180') {
            bfSelect.innerHTML = `<option value="18">18 BF (Golden)</option>`;
          } else if (gsm == '210') {
            bfSelect.innerHTML = `<option value="16">16 BF (Golden)</option>`;
          } else if (gsm == '225' || gsm == '270') {
            bfSelect.innerHTML = `<option value="22">22 BF (Golden)</option>`;
          }
        }
      }
    };

    typeSelect.addEventListener('change', updateBF);
    gsmSelect.addEventListener('change', updateBF);

    // Trigger the update to initialize the options
    updateBF();
  });
};

// Function to update options for GSM in odd layers
const updateEvenLayers = () => {
  const layers = document.querySelectorAll('.layer');

  layers.forEach((layer, index) => {
    if (index % 2 !== 0) {
      const prevGsmSelect = layers[index - 1].querySelector('.gsm');
      const floatGsmSelect = layer.querySelector('.floatGsm');

      const updateFloatGsmOptions = () => {
        floatGsmSelect.innerHTML = '';

        const prevGsm = parseFloat(prevGsmSelect.value);

        let options = [];

        if (prevGsm === 100) {
          options = [150];
        } else if (prevGsm === 120) {
          options = [150, 180];
        } else if (prevGsm === 140) {
          options = [150, 180, 210];
        } else if (prevGsm === 150) {
          options = [150, 180, 210, 225];
        } else if (prevGsm === 180) {
          options = [150, 180, 210, 225, 270];
        }

        options.forEach(gsm => {
          floatGsmSelect.innerHTML += `<option value="${gsm}">${gsm} GSM</option>`;
        });

        floatGsmSelect.dispatchEvent(new Event('change'));
      };

      prevGsmSelect.addEventListener('change', updateFloatGsmOptions);

      updateFloatGsmOptions();
    }
  });
};

// Event listener for Ply selection
const plySelect = document.getElementById('plySelect');
plySelect.addEventListener('change', (e) => {
  const ply = e.target.value;
  updateLayers(ply);
});

// Function to update layers based on Ply selection
const updateLayers = (ply) => {
  const layersContainer = document.getElementById('layersContainer');
  layersContainer.innerHTML = '';

  let numLayers = ply === '3' ? 3 : ply === '5' ? 5 : ply === '7' ? 7 : 3;

  for (let i = 0; i < numLayers; i++) {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'layer';

    let gsmSelectHTML = '';

    if (i % 2 === 0) {
      gsmSelectHTML = `
        <select class="gsm" required id="gsm${i}">
          <option value="100">100 GSM</option>
          <option value="120">120 GSM</option>
          <option value="140">140 GSM</option>
          <option value="150">150 GSM</option>
          <option value="180">180 GSM</option>
        </select>
      `;
    } else {
      gsmSelectHTML = `
        <select class="floatGsm gsm" required id="gsm${i}">
          <!-- Options will be dynamically populated -->
        </select>
      `;
    }

    layerDiv.innerHTML = `
      <label>Layer ${i + 1} GSM:</label>
      ${gsmSelectHTML}
      <label>Layer ${i + 1} Type:</label>
      <select class="type" required>
        <option value="Natural">Natural</option>
        <option value="Golden">Golden</option>
      </select>
      <label>Layer ${i + 1} BF:</label>
      <select class="bf" required>
        <!-- Options will be dynamically populated -->
      </select>
    `;

    layersContainer.appendChild(layerDiv);
  }

  updateBFOptions();
  updateEvenLayers();
};

// Initialization: Update layers based on initial Ply selection
updateLayers('3');

// Function to calculate weight
function calculateWeight() {
  const sheetSize = parseFloat(document.getElementById('sheetSizeResult').innerText.split(' ')[2]);
  const layers = parseInt(document.getElementById('plySelect').value);
  let totalGSM = 0;

  for (let i = 0; i < layers; i++) {
    const gsm = parseFloat(document.getElementById(`gsm${i}`).value);
    totalGSM += gsm;
  }

  const weight = (((sheetSize * totalGSM) / 1550) / 1000);
  document.getElementById('weightResult').innerHTML = `Weight: ${weight.toFixed(2)} kg`;
}

// Function to calculate box price
function calculateBoxPrice() {
  const weight = parseFloat(document.getElementById('weightResult').innerText.split(' ')[1]);
  const laborCharges = parseFloat(document.getElementById('laborCharge').value);

  let boxPricePart1 = weight * laborCharges;

  document.getElementById('boxPriceResult1').innerHTML = `Box price part1 => ${boxPricePart1.toFixed(2)}`

  let boxPricePart2 = 0;

  const layers = document.querySelectorAll('.layer');
  const newLayers = [...layers]
  console.log(layers, 'this is the layer part')
  newLayers.forEach((layer, index) => {
    const gsm = parseFloat(document.getElementById(`gsm${index}`).value);
    const type = layer.querySelector('.type').value;
    const bf = layer.querySelector('.bf').value;

    let rate;

    if (type === 'Natural') {
      if (gsm == '100' && bf == '16') rate = 32.50;
      if (gsm == '120' && bf == '16') rate = 32.00;
      if (gsm == '140' && bf == '16') rate = 32.25;
      if (gsm == '150' && bf == '16') rate = 32.50;
      if (gsm == '180' && bf == '16') rate = 32.00;
      if (gsm == '210' && bf == '16') rate = 32.25;
    } else if (type === 'Golden') {
      if (gsm == '140' && bf == '16') rate = 33.50;
      if (gsm == '120' && bf == '18') rate = 34.50;
      if (gsm == '150' && bf == '22') rate = 38.00;
      if (gsm == '180' && bf == '22') rate = 38.25;
      if (gsm == '210' && bf == '16') rate = 33.50;
      if (gsm == '180' && bf == '18') rate = 34.50;
      if (gsm == '225' && bf == '22') rate = 38.00;
      if (gsm == '270' && bf == '22') rate = 38.25;
    }
    const sheetSizeVal = document.getElementById('sheetSizeResult').innerText.split(' ')[2]
  
    const individualWeight = (((sheetSizeVal * gsm) / 1550) / 1000);
    boxPricePart2 += individualWeight * rate;
  });

  const boxPrice = boxPricePart1 + boxPricePart2;
  document.getElementById('boxPriceResult').innerHTML = `Box Price: ${boxPrice.toFixed(2)}`;
}

// Function to calculate final price
function calculateFinalPrice() {
  const boxPrice = parseFloat(document.getElementById('boxPriceResult').innerText.split(' ')[2]);
  const profitMargin = parseFloat(document.getElementById('profitMargin').value);
  const finalBoxPrice = boxPrice * (1 + profitMargin / 100);

  document.getElementById('finalPriceResult').innerHTML = `Final Box Price: ${finalBoxPrice.toFixed(2)}`;
}

// Event listeners
document.getElementById('calculateSheetSizeBtn').addEventListener('click', calculateSheetSize);
document.getElementById('calculateBoxPriceBtn').addEventListener('click', calculateBoxPrice);
document.getElementById('calculateFinalPriceBtn').addEventListener('click', calculateFinalPrice);
document.getElementById('calculateWeightBtn').addEventListener('click', calculateWeight);

// Initial calculation on page load
calculateSheetSize();



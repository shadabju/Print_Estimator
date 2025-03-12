document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("printing-form");
  const costDisplay = document.getElementById("cost-display");
  const costValue = document.getElementById("cost-value");

  form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get input values
      const printingType = document.getElementById("printing-type").value;
      const materialType = document.getElementById("material-type").value;
      const gsm = parseFloat(document.getElementById("gsm").value) || 0;
      const materialSize = document.getElementById("material-size").value;
      const quantity = parseInt(document.getElementById("quantity").value) || 0;
      const colorOptions = document.getElementById("color-options").value;
      const finishingOptions = document.getElementById("finishing-options").value;
      const inkOptions = document.getElementById("ink-options").value;
      const numberOfSides = document.getElementById("number-of-sides").value;
      
      // Check for missing fields (excluding material size)
      const missingFields = [];
      if (!printingType) missingFields.push("Printing Type");
      if (!materialType) missingFields.push("Material Type");
      if (!gsm) missingFields.push("GSM");
      if (!quantity) missingFields.push("Quantity");
      if (!colorOptions) missingFields.push("Color Options");
      if (!finishingOptions) missingFields.push("Finishing Options");
      if (!inkOptions) missingFields.push("Ink Options");
      if (!numberOfSides) missingFields.push("Number of Sides");
      
      if (missingFields.length > 0) {
          costValue.textContent = `Missing field: ${missingFields.join(", ")}`;
          costDisplay.classList.remove("hidden");
          return;
      }

      // Impossible process conditions
      if ((printingType === "flexo" && (materialType === "paper" || materialType === "paperboard")) ||
          (printingType === "flexo" && inkOptions === "paste-ink") ||
          (printingType === "gravure" && inkOptions === "paste-ink") ||
          (printingType === "offset" && (materialType === "foil" || materialType === "film"))) {
          costValue.textContent = "Impossible process";
          costDisplay.classList.remove("hidden");
          return;
      }

      // Define cost factors (Example values, adjust as needed)
      const setupCosts = { flexo: 300, gravure: 500, digital: 50, offset: 200 };
      const runningCosts = { flexo: 0.01, gravure: 0.008, digital: 0.05, offset: 0.015 };
      const substrateCosts = { paper: 1.5, paperboard: 2, foil: 3, film: 2.5 };
      const inkCosts = { "solvent-based": 20, "water-based": 15, "paste-ink": 25 };
      const finishingCosts = { lamination: 0.5, uncoated: 0, binding: 1, cutting: 0.2, creasing: 0.3 };
      const colorMultiplier = { "single-color": 1, "multi-color": 1.5 };
      const sideMultiplier = { One: 1, Two: 1.8 };

      // Calculate area per sheet
      let areaPerSheet;
      if (materialSize === "a3") {
          areaPerSheet = 0.125; // Example: A3 size in m²
      } else if (materialSize === "a4") {
          areaPerSheet = 0.0625; // Example: A4 size in m²
      } else {
          areaPerSheet = 0.1; // Default or custom size (adjust as needed)
      }

      // Calculate substrate cost
      const totalArea = areaPerSheet * quantity;
      const totalWeight = totalArea * gsm / 1000; // Convert to kg
      const substrateCost = totalWeight * (substrateCosts[materialType] || 1.5);

      // Calculate ink cost
      const inkUsage = totalArea * 3; // Assuming 3g/m² usage
      const inkCost = (inkUsage / 1000) * (inkCosts[inkOptions] || 20);

      // Calculate process cost
      const setupCost = setupCosts[printingType] || 200;
      const runningCost = (runningCosts[printingType] || 0.01) * quantity;
      const processCost = setupCost + runningCost;

      // Calculate finishing cost
      const finishingCost = (finishingCosts[finishingOptions] || 0) * quantity;

      // Calculate total cost
      const totalCost = (substrateCost + inkCost + processCost + finishingCost) * 
                        (colorMultiplier[colorOptions] || 1) * (sideMultiplier[numberOfSides] || 1);
      
      // Display result
      costValue.textContent = `₹${totalCost.toFixed(2)}`;
      costDisplay.classList.remove("hidden");
  });
});

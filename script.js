// Global variables
let barChartInstance = null;
let selectedPeriod = 1;
let currentLanguage = 'en';

// Custom translation system - translations loaded from translations.js

// Format currency (Colombian display format)
function formatCurrency(num) {
  return "$" + Math.round(num).toLocaleString("es-CO");
}

// Format number with commas
function formatNumber(num) {
  return num.toLocaleString("en-US");
}

// Parse number with commas
function parseNumber(str) {
  return parseFloat(str.replace(/,/g, "")) || 0;
}

// Calculate all metrics
function calculateMetrics() {
  const capacity = parseInt(document.getElementById("capacity").value) || 0;
  const weeklyCheckins = parseFloat(document.getElementById("weeklyCheckins").value) || 0;
  const atv = parseNumber(document.getElementById("atv").value);
  const ltv = parseFloat(document.getElementById("ltv").value) || 0;

  // Calculate base metrics
  const guestsPerMonth = weeklyCheckins * 4.33;
  const commissionPerGuest = (atv * 0.15) + ((ltv - 1) * atv * 0.05);

  // Define scenarios
  const scenarios = {
    passive: { name: "Passive", rate: 0.2 },
    active: { name: "Active", rate: 0.5 },
    intensive: { name: "Intensive", rate: 0.8 }
  };

  // Calculate commissions for each scenario and timeframe
  Object.keys(scenarios).forEach((scenario) => {
    const conversionRate = scenarios[scenario].rate;
    const convertedGuests = guestsPerMonth * conversionRate;
    
    // Calculate for different timeframes
    const todayCommission = convertedGuests * commissionPerGuest * 1;
    const sixMonthCommission = convertedGuests * commissionPerGuest * 6;
    const twelveMonthCommission = convertedGuests * commissionPerGuest * 12;

    // Update KPI cards based on selected period
    let currentCommission;
    if (selectedPeriod === 1) {
      currentCommission = todayCommission;
    } else if (selectedPeriod === 6) {
      currentCommission = sixMonthCommission;
    } else {
      currentCommission = twelveMonthCommission;
    }

    // Update KPI card
    document.getElementById(`${scenario}Commission`).textContent = formatCurrency(currentCommission);
    
    // Calculate and update referrals
    const referrals = Math.round(convertedGuests * selectedPeriod);
    document.getElementById(`${scenario}Referrals`).textContent = referrals;
  });

  // Update chart
  updateChart(scenarios, guestsPerMonth, commissionPerGuest);
}

// Create chart data based on selected period
function getChartData(scenarios, guestsPerMonth, commissionPerGuest) {
  const labels = Object.keys(scenarios).map((key) => scenarios[key].name);
  
  // Calculate base data (1 month)
  const baseData = Object.keys(scenarios).map((key) => {
    const conversionRate = scenarios[key].rate;
    const convertedGuests = guestsPerMonth * conversionRate;
    return convertedGuests * commissionPerGuest * 1;
  });

  // Calculate additional data for stacking
  const sixMonthAdditional = Object.keys(scenarios).map((key) => {
    const conversionRate = scenarios[key].rate;
    const convertedGuests = guestsPerMonth * conversionRate;
    return convertedGuests * commissionPerGuest * 5; // Additional 5 months
  });

  const twelveMonthAdditional = Object.keys(scenarios).map((key) => {
    const conversionRate = scenarios[key].rate;
    const convertedGuests = guestsPerMonth * conversionRate;
    return convertedGuests * commissionPerGuest * 6; // Additional 6 months
  });

  const datasets = [
    {
      label: "1 Month",
      data: baseData,
      backgroundColor: [
        "rgba(255, 199, 74, 0.6)",
        "rgba(0, 119, 182, 0.6)", 
        "rgba(242, 109, 163, 0.6)"
      ],
      borderColor: [
        "rgba(255, 199, 74, 1)",
        "rgba(0, 119, 182, 1)",
        "rgba(242, 109, 163, 1)"
      ],
      borderWidth: 2,
      borderRadius: 8,
    }
  ];

  // Add additional months based on selected period
  if (selectedPeriod >= 6) {
    datasets.push({
      label: "Additional 5 Months",
      data: sixMonthAdditional,
      backgroundColor: [
        "rgba(255, 199, 74, 0.8)",
        "rgba(0, 119, 182, 0.8)", 
        "rgba(242, 109, 163, 0.8)"
      ],
      borderColor: [
        "rgba(255, 199, 74, 1)",
        "rgba(0, 119, 182, 1)",
        "rgba(242, 109, 163, 1)"
      ],
      borderWidth: 2,
      borderRadius: 8,
    });
  }

  if (selectedPeriod >= 12) {
    datasets.push({
      label: "Additional 6 Months",
      data: twelveMonthAdditional,
      backgroundColor: [
        "rgba(255, 199, 74, 1)",
        "rgba(0, 119, 182, 1)", 
        "rgba(242, 109, 163, 1)"
      ],
      borderColor: [
        "rgba(255, 199, 74, 1)",
        "rgba(0, 119, 182, 1)",
        "rgba(242, 109, 163, 1)"
      ],
      borderWidth: 2,
      borderRadius: 8,
    });
  }

  return {
    labels: labels,
    datasets: datasets
  };
}

// Update or create chart
function updateChart(scenarios, guestsPerMonth, commissionPerGuest) {
  const ctx = document.getElementById("barChart").getContext("2d");
  const chartData = getChartData(scenarios, guestsPerMonth, commissionPerGuest);

  if (barChartInstance) {
    // Update existing chart
    barChartInstance.data = chartData;
    barChartInstance.update('active');
  } else {
    // Create new chart
    barChartInstance = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": " + formatCurrency(context.parsed.y);
              },
            },
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                family: "Parkinsans",
                size: 18,
                weight: "bold"
              },
              color: "#2d3748"
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              font: {
                family: "Parkinsans",
                size: 16,
                weight: "600"
              },
              color: "#4a5568",
              callback: function (value) {
                return formatCurrency(value);
              },
            },
          },
        },
      },
    });
  }
}

// Handle toggle switch clicks
function handleToggleSwitch(period) {
  selectedPeriod = period;

  // Update active state for Bootstrap buttons
  document.querySelectorAll("[data-period]").forEach((btn) => {
    btn.classList.remove("active");
    btn.classList.remove("btn-del-parche-pink");
    btn.classList.remove("text-white");
    btn.classList.add("btn-outline-del-parche-pink");
  });
  
  const activeBtn = document.querySelector(`[data-period="${period}"]`);
  activeBtn.classList.add("active");
  activeBtn.classList.remove("btn-outline-del-parche-pink");
  activeBtn.classList.add("btn-del-parche-pink");
  activeBtn.classList.add("text-white");

  // Recalculate metrics
  calculateMetrics();
}

// ATV input formatting
function formatATVInput() {
  const input = document.getElementById("atv");
  const value = input.value.replace(/,/g, "");
  const numValue = parseFloat(value);
  
  if (!isNaN(numValue)) {
    input.value = formatNumber(numValue);
  }
}

// Update all text elements with current language
function updateLanguage() {
  console.log('Updating language to:', currentLanguage);
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);
    console.log(`Key: ${key}, Translation: ${translation}`);
    element.textContent = translation;
  });
}

// Get translation for a key
function getTranslation(key) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      console.log(`Translation not found for key: ${key}`);
      return key; // Return the key if translation not found
    }
  }
  
  return value || key; // Fallback to key if translation not found
}

// Handle language switching
function handleLanguageSwitch(lang) {
  currentLanguage = lang;
  updateLanguage();
  
  // Update active language button for Bootstrap buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.remove('btn-del-parche-pink');
    btn.classList.remove('text-white');
    btn.classList.add('btn-outline-del-parche-pink');
  });
  
  const activeLangBtn = document.querySelector(`[data-lang="${lang}"]`);
  activeLangBtn.classList.add('active');
  activeLangBtn.classList.remove('btn-outline-del-parche-pink');
  activeLangBtn.classList.add('btn-del-parche-pink');
  activeLangBtn.classList.add('text-white');
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Test translations
  console.log('Translations object:', translations);
  console.log('English title:', translations.en.title);
  console.log('Spanish title:', translations.es.title);
  
  // Initialize language
  updateLanguage();
  
  // Add event listeners to language buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      handleLanguageSwitch(lang);
    });
  });

  // Add event listeners to all inputs
  const inputs = [
    "capacity",
    "weeklyCheckins", 
    "atv",
    "ltv"
  ];

  inputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", calculateMetrics);
    }
  });

  // Special handling for ATV input
  const atvInput = document.getElementById("atv");
  if (atvInput) {
    atvInput.addEventListener("focus", function () {
      this.value = this.value.replace(/,/g, "");
    });
    atvInput.addEventListener("blur", formatATVInput);
  }

  // Add event listeners to toggle switches
  document.querySelectorAll("[data-period]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const period = parseInt(this.getAttribute("data-period"));
      handleToggleSwitch(period);
    });
  });

  // Initial calculation
  calculateMetrics();
});
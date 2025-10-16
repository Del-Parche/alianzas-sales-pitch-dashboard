# Del Parche Commission Calculator

A modern, touch-friendly commission calculator web app for Del Parche tour company, designed for tablet use during sales pitches to hostels in Bogotá.

## Features

- **Touch-Optimized Design**: Built for 11" Android tablets in horizontal orientation
- **Real-Time Calculations**: Instant updates as you input data
- **Stacked Bar Charts**: Visual comparison of commission scenarios over time
- **Interactive Time Periods**: Switch between 1, 6, and 12-month projections
- **Stripe-Inspired UI**: Clean, modern design with gradient cards
- **100% Offline Capable**: Works without internet once loaded

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel deployment config
└── README.md          # This file
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alianzas-sales-pitch-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   Or simply open `index.html` in your browser.

## Deployment to Vercel

### Option 1: Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Option 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on every push

### Option 3: Drag & Drop
1. Go to [vercel.com](https://vercel.com)
2. Drag the project folder to deploy

## Usage

### Input Fields
- **Capacity**: Number of beds in the hostel
- **Weekly Check-Ins**: Average weekly guest arrivals
- **Average Ticket Value (COP)**: Price per booking in Colombian Pesos
- **Lifetime Bookings (LTV)**: Average bookings per guest over their lifetime
- **Commission Rates**: Fixed at 15% first booking, 5% repeat bookings

### KPI Cards
Show commission revenue for each engagement scenario:
- **Passive**: 20% conversion rate
- **Active**: 50% conversion rate  
- **Intensive**: 80% conversion rate

### Time Period Controls
- **1M**: Shows 1-month commission data
- **6M**: Shows 1-month + 6-month stacked data
- **12M**: Shows 1-month + 6-month + 12-month stacked data

## Technical Details

- **Framework**: Vanilla HTML, CSS, JavaScript
- **Charts**: Chart.js (loaded via CDN)
- **Responsive**: Mobile-first design with tablet optimization
- **Performance**: Optimized for fast loading and smooth interactions
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Customization

### Colors
Edit the CSS variables in `styles.css`:
- Primary: `#635bff` to `#4f46e5`
- Secondary: `#00d4ff` to `#0099cc`
- Tertiary: `#10b981` to `#059669`

### Commission Rates
Modify the rates in `script.js`:
```javascript
const commissionPerGuest = atv * 0.15 + (ltv - 1) * atv * 0.05;
```

### Conversion Rates
Update scenario rates in `script.js`:
```javascript
const scenarios = {
  passive: { rate: 0.2, name: "Passive" },
  active: { rate: 0.5, name: "Active" },
  intensive: { rate: 0.8, name: "Intensive" },
};
```

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please contact the Del Parche development team.

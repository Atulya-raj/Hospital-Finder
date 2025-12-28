# 🏥 Hospital Finder

A modern, full-stack web application that helps users locate hospitals in India by pincode, with real-time distance calculations and Google Maps integration.

![Hospital Finder](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- 🔍 **Smart Search** - Search hospitals by pincode using India's official data.gov.in API
- 📍 **Location-Based Distance** - Automatically calculates distance from user's current location
- 🗺️ **Google Maps Integration** - One-click navigation to hospital locations
- 🎨 **Modern UI/UX** - Beautiful gradient design with smooth animations
- ⚡ **Loading States** - Elegant loading animations for better user experience
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎭 **Empty States** - Helpful suggestions when no results are found
- 🌈 **Animated Background** - Dynamic gradient backgrounds with medical-themed elements

## 🚀 Demo

[Live Demo](#) <!-- Add your deployed link here later -->

## 📸 Screenshots

<!-- Add screenshots here after deployment -->

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- CSS3 with custom animations
- Geolocation API
- Google Maps integration

### Backend
- Node.js with Express
- data.gov.in API
- CORS enabled

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- data.gov.in API key

### Installation

1. **Clone the repository**

2. **Install dependencies**

3. **Set up environment variables**

Create a `.env` file in the root directory:

> **Get your API key**: Visit [data.gov.in](https://data.gov.in/) and register for a free API key

4. **Start the backend server**

5. **Start the React development server** (in a new terminal)

6. **Open your browser**

## 🎯 How It Works

1. **User enters pincode** → Frontend sends request to backend
2. **Backend queries data.gov.in API** → Filters hospitals by pincode
3. **Frontend displays results** → Shows hospital name, address, distance
4. **User clicks "View on Map"** → Opens Google Maps with directions

## 🔧 Configuration

### Backend Port
Default: `5000` (change in `server.js` if needed)

### Frontend Port
Default: `3000` (React default)

## 🌟 Key Features Explained

### Distance Calculation
Uses the Haversine formula to calculate accurate distances between user location and hospitals.

### Google Maps Integration
- Opens in new tab for desktop users
- Opens in Google Maps app for mobile users
- Fallback to name search if coordinates unavailable

### Loading States
Smooth animations to improve user experience during API calls.

## 🚧 Future Enhancements

- [ ] Hospital details modal (phone, services, specialties)
- [ ] Filter by hospital type (government/private)
- [ ] Save favorite hospitals
- [ ] Multi-pincode search
- [ ] Dark mode
- [ ] PWA support
- [ ] Export results to PDF

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Atulya Raj**
- GitHub: (https://github.com/Atulya-raj)
- LinkedIn: https://www.linkedin.com/in/atulya-raj-87732a30a/

## 🙏 Acknowledgments

- [data.gov.in](https://data.gov.in/) - For the National Hospital Directory API
- [Google Maps](https://maps.google.com) - For location services
- React & Node.js communities

---

⭐ **If you find this project helpful, please consider giving it a star!**

---

## 📞 Support

For support, email atulya.raj6740@gmail.com or open an issue in this repository.

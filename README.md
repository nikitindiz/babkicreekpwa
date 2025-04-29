# <img src="assets/babki-creek-logo.svg" width="55" style="display: inline-block; position: relative; bottom: -12px; margin: 0 -5px 0 -10px"/> Babki Creek PWA

App available at https://nikitindiz.github.io/babkicreekpwa/

A Progressive Web Application for personal finance management that visualizes your money flow over time, making budget tracking intuitive and simple.

<img src="assets/babki-creek-preview.gif" alt="Babki Creek PWA Preview" width="300" />

## Features

- **Intuitive Money Flow Visualization**: See your financial balance changes over time with a stream-like graph
- **Minimal Input Requirements**: Only amount is mandatory, making expense tracking quick and simple
- **Recurring Transactions**: Set up recurring incomes and expenses to forecast your future balance
- **Multiple Profiles**: Maintain separate budgets for different purposes
- **Offline Capabilities**: Use the app even without an internet connection
- **Data Import/Export**: Easily backup and transfer your financial data

## Technologies Used

- React
- Service Workers for PWA functionality
- IndexedDB for offline data storage
- Responsive CSS/SCSS

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/babkicreekpwa.git
   cd babkicreekpwa
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Building for Production

```
npm run build
```

This will create a production-ready build in the `build` folder.

## Deployment

The PWA can be deployed to any static hosting service. For optimal PWA experience, ensure your hosting provider supports HTTPS.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add a changelog entry:
   - Create a new YAML file in `changelogs/next/` directory
   - Follow the format in the example file with `type` (improvement, bugfix, or feature) and `description`
   - Changelog entries are automatically processed when versioning the app
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Changelog System

The project uses a structured changelog system:

- Create a new YAML file in the `changelogs/next/` directory for each change
- The file should include a `type` field (improvement, bugfix, or feature) and a `description` field
- When a new version is released, these files are automatically processed by the versioning script
- The `example.yaml` file in that directory serves as a template and is not included in processing

Example changelog entry:

```yaml
type: feature
description: |
  Add dark mode support for better visibility in low-light conditions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About Babki Creek

Babki Creek was created to solve common problems with existing budget tracking apps:

1. **Visualizing Money as a Flow**: Most finance apps use charts that are difficult to interpret. Babki Creek visualizes your finances as a stream that widens with income and narrows with expenses, providing an intuitive view of your financial health.

2. **Simplicity First**: Many finance apps require too much information. Babki Creek prioritizes simplicity - only the amount is mandatory, while other fields like date and description are optional.

This project started as a React Native app in 2020 and was reimagined as a PWA in 2023 to leverage modern browser capabilities, including IndexedDB for client-side data storage.

## Current Development Status

This is a pet project and is still in development. While functional, it's best suited for short-term (3 months) financial tracking rather than long-term financial management. Contributions to improve stability and features are welcome!

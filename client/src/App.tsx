import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/demo' element={<DemoPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

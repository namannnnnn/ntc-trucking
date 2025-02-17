import './App.css';
import {Container} from 'react-bootstrap';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
// import ProductScreen from './screens/ProductScreen';
// import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import ShippingScreen from './screens/ShippingScreen';
// import PaymentScreen from './screens/PaymentScreen';
// import PlaceOrderScreen from './screens/PlaceOrderScreen';
// import OrderScreen from './screens/OrderScreen';
// import UserListScreen from './screens/UserListScreen';
// import UserEditScreen from './screens/UserEditScreen';
// import ProductListScreen from './screens/ProductListScreen';
// import ProductEditScreen from './screens/ProductEditScreen';
// import OrderListScreen from './screens/OrderListScreen';

//SNEAKEROTIC

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            {/* <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/admin/orderList" component={OrderListScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/profile" component={ProfileScreen} /> */}
            <Route path="/login" component={LoginScreen} />
            {/* <Route path="/register" component={RegisterScreen} />
            <Route path="/admin/user/:id/edit" component={UserEditScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/admin/productlist" component={ProductListScreen} />
            <Route path="/admin/product/:id/edit" component={ProductEditScreen}/>
            <Route path="/admin/userlist" component={UserListScreen} /> */}
            <Route path="/" component={HomeScreen} exact />
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;

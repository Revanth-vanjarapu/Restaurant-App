import {AiOutlineShoppingCart} from 'react-icons/ai'

const Header = ({name, cart}) => (
  <header>
    <h1>{name}</h1>
    <button type="button" className="orders-button">
      <span>My Orders</span> <AiOutlineShoppingCart className="icon" />
      <span className="cart-count">{cart}</span>
    </button>
  </header>
)
export default Header

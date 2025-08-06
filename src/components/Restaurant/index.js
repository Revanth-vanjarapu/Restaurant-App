import {Component} from 'react'
import Header from '../Header'
import './styles.css'

class Restaurant extends Component {
  state = {
    restaurent: 'Logo',
    cart: 0,
    menu: [],
    active: '',
    items: [],
    dishes: [],
    cartItems: {},
  }

  componentDidMount() {
    this.restaurentData()
  }

  menuItems = id => {
    const {menu} = this.state
    const menuList = menu.find(eachitem => eachitem.menu_category_id === id)
    this.setState({
      items: menuList,
      dishes: menuList.category_dishes,
      active: menuList.menu_category_id,
    })
  }

  increase = id => {
    this.setState(prevState => {
      const prevQty = prevState.cartItems[id] || 0
      const newQty = prevQty + 1

      return {
        cartItems: {
          ...prevState.cartItems,
          [id]: newQty,
        },
        cart: prevState.cart + 1,
      }
    })
  }

  decrease = id => {
    this.setState(prevState => {
      const prevQty = prevState.cartItems[id] || 0
      if (prevQty === 0) return null

      const newQty = prevQty - 1
      const updatedCartItems = {
        ...prevState.cartItems,
        [id]: newQty,
      }

      if (newQty === 0) {
        delete updatedCartItems[id]
      }

      return {
        cartItems: updatedCartItems,
        cart: prevState.cart - 1,
      }
    })
  }

  restaurentData = async () => {
    const url =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

    const response = await fetch(url)
    const data = await response.json()
    this.setState(
      {
        restaurent: data[0].restaurant_name,
        menu: data[0].table_menu_list,
        active: data[0].table_menu_list[0].menu_category_id,
      },
      () => this.menuItems(data[0].table_menu_list[0].menu_category_id),
    )
  }

  render() {
    const {
      restaurent,
      cart,
      menu,
      active,
      items,
      dishes,
      cartItems,
    } = this.state
    console.log(cartItems)

    return (
      <div className="menu-page">
        <Header name={restaurent} cart={cart} />
        <nav>
          <ul className="categories">
            {menu.map(eachitem => (
              <li
                key={eachitem.menu_category_id}
                className={
                  active === eachitem.menu_category_id ? 'active' : null
                }
              >
                <button
                  type="button"
                  className="no-btn"
                  onClick={() => this.menuItems(eachitem.menu_category_id)}
                >
                  {eachitem.menu_category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <section className="menu-list">
          {dishes.map(eachitem => (
            <div key={eachitem.dish_id} className="menu-item">
              <span
                className={
                  eachitem.dish_Type === 2
                    ? 'food-symbol veg'
                    : 'food-symbol non-veg'
                }
              />
              <div className="menu-details">
                <h2>{eachitem.dish_name}</h2>
                <p>{eachitem.dish_description}</p>
                <p>
                  <strong>
                    {eachitem.dish_currency} {eachitem.dish_price}
                  </strong>
                </p>

                {eachitem.dish_Availability ? (
                  <>
                    <div className="quantity-selector">
                      <button
                        type="button"
                        onClick={() => this.decrease(eachitem.dish_id)}
                      >
                        -
                      </button>
                      <span>{cartItems[eachitem.dish_id] || 0}</span>

                      <button
                        type="button"
                        onClick={() => this.increase(eachitem.dish_id)}
                      >
                        +
                      </button>
                    </div>
                    {eachitem.addonCat.length > 0 && (
                      <p className="customizations">Customizations available</p>
                    )}
                  </>
                ) : (
                  <p className="unavailable">Not available</p>
                )}
              </div>
              {eachitem.dish_calories && (
                <p className="calories">{eachitem.dish_calories} calories</p>
              )}
              <img
                src={eachitem.dish_image}
                alt={eachitem.dish_name}
                className="menu-img"
              />
            </div>
          ))}
        </section>
      </div>
    )
  }
}

export default Restaurant

const storeToken = (value) => {
  if (value) {
    const { access, refresh } = value;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

const getToken = () => {
  let access_token = localStorage.getItem("access_token");
  let refresh_token = localStorage.getItem("refresh_token");

  return { access_token, refresh_token };
};

const removeToken = () => {
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};


// storing logged user data in localStorage
const storeUser = (user) => {
  if(user){
    const {email, name} = user;

    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
  }
}
const getUser = () => {
  let email = localStorage.getItem("email")
  let name = localStorage.getItem("name")

  return {email, name}
}
const removeUser = () => {
  localStorage.removeItem("email")
  localStorage.removeItem("name")
}


// wishlist mapping object 

const storeUserWishlistMapping = (mappingObject) => {
  if(mappingObject){
    localStorage.setItem('userWishlistMapping', JSON.stringify(mappingObject))
  }
}

const getUserWishlistMapping = () => {
  const userWishlistMapping = localStorage.getItem('userWishlistMapping');
  return userWishlistMapping ? JSON.parse(userWishlistMapping) : {};
}


// orders placed
const storeOrdersPlaced = (orderIds) => {
  // console.log(orderIds)
  if(orderIds){
    localStorage.setItem('placedOrderIds', JSON.stringify(orderIds))
  }
}

const getOrdersPlaced = () => {
  const getOrderIds = localStorage.getItem('placedOrderIds');
  return getOrderIds ?  JSON.parse(getOrderIds) : [];
}

export {storeToken, getToken, removeToken, storeUser, getUser, removeUser, storeUserWishlistMapping, getUserWishlistMapping, storeOrdersPlaced, getOrdersPlaced}

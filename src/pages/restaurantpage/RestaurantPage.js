import React, { useState, useEffect } from "react";
import CardFood from "../../components/CardFood/CardFood";
import ModalQuantityFood from "../../components/ModalQuantityFood/ModalQuantityFood";
import { BASE_URL } from "../../constants/urls";
import { useRequestData } from "../../hooks/useRequestData";
import { useParams, useNavigate } from "react-router-dom";
//import {useProtectedPage} from "../../hooks/useProtectedPage"
import { GlobalStateContext } from "../../components/Global/GlobalStateContext";
import { useContext } from "react";
import Footer from "../../components/Footer/Footer";
import CardRestaurant from "../../components/CardRestaurant/CardRestaurant";
import CircularProgress from '@material-ui/core/CircularProgress';
import {CentralizeLoading, RestaurantPageContainer} from './styled'
import styled from 'styled-components';
import Header from "../../components/Header/Header";
import { useProtectedPage } from "../../hooks/useProtectedPage";

const Badge = styled.div`
display:flex;
align-items:center;
justify-content:center;
background-color: #E86E5A;
position: relative;
right: -40px;
top: -15px;
color: #fff;
padding: 0.5rem;
height: 10px;
width: 10px;
border-radius: 50%;
`

const RestaurantPage = () => {
  useProtectedPage();
  const [quantityProduct , setQuantityProduct] = useState(0)
  const [productSelected, setProdutcSelected] = useState({})
  const [showBadge, setShowBadge] = useState(false);
  const [btn, setBtn] = useState([]);
  const [category, setCategory] = useState([]);

  const { states, sets } = useContext(GlobalStateContext);
  const pathParams = useParams();
  const [foods, isLoadingFoods, errorFoods] = useRequestData(
    `${BASE_URL}/restaurants/${pathParams.id}`
  );
  const navigate = useNavigate();


  useEffect(() => {
    sets.setOpenModal(false);
    {states.cart.length > 0 ? setShowBadge(true) : setShowBadge(false)}
  }, []);

  const onChangeQuantity = (event) => {
    setQuantityProduct(event.target.value);
  };

  const AddProductToCart = (prod) => {
    if(states.restaurantId && states.restaurantId !== pathParams.id){
      if(window.confirm("Quer modificar seu pedido? Lembre-se que você tem produtos adicionados na sua cesta. Deseja remover estes produtos e adicionar novos?")){
        sets.setRestaurantId("")
        sets.setCart([])
        setProdutcSelected(prod);
        sets.setOpenModal(true);
      }
    }else{
      setProdutcSelected(prod);
      sets.setOpenModal(true);
  };
}

  const addCart = (product, quantity) => {
    console.log("QUANTIDADE", quantity)
    let quant = quantity
    console.log("quant", quant)
    if(quant === 0){
       quant = quant + 1
    }
  
    const foodItem = {
      ...product,
      quantity: quant,
      btnValue: "remover",
      idRestaurant: Number(pathParams.id),
    };

    const newCart = [...states.cart, foodItem];
    sets.setCart(newCart);
    sets.setOpenModal(false);
    const foodItemBtn = {
      ...product,
      quantity: quant,
      btnValue: "remover",
      idRestaurant: pathParams.id,
    };
    const newBtn = [...btn, foodItemBtn];
    setBtn(newBtn);
    sets.setOpenModal(false)
    setShowBadge(true)
    sets.setRestaurantId(pathParams.id)
  };

  const listFoods =
    foods &&
    foods.restaurant &&
    foods.restaurant.products.map(
      (product) => {

        const quantityOnCart = states.cart && states.cart.map((cart)=>{
          if(cart.id === product.id){
            return <Badge onClick={() => navigate("/carrinho")}>{cart.quantity}</Badge>
          } 
        });

      const changeBtnValue =
        states.cart &&
        states.cart.map((cart) => {
          if (cart.id === product.id) {
            return cart.btnValue;
          }
        });

      const toRemove = () => {
        const updateProductsInCart =
          states.cart &&
          states.cart
            .map((item) => {
              if (item.id === product.id) {
                //  return item.quantity = item.quantity -1
                return {
                  ...item,
                  quantity: item.quantity - 1,
                };
              }
              return item;
            })
            .filter((item) => {
              return item.quantity > 0;
            });

        sets.setCart(updateProductsInCart);

        console.log("REMOVI", states.cart);
      };

      return (
        <CardFood
          prodSelected={productSelected}
          product={product}
          key={product.id}
          restaurantId={pathParams.id}
          quantity={quantityProduct}
          senQuantity={quantityOnCart}
          addCart={addCart}
          onChangeQuantity={onChangeQuantity}
          onClickAdd={() => AddProductToCart(product)}
          onClickRemove={toRemove}
          sendBtnChange={changeBtnValue}
          showBadge={showBadge}
        />
      );
    });
  return (
    <RestaurantPageContainer>
      <Header />

      {foods && foods.restaurant && (
        <CardRestaurant
          image={foods.restaurant.logoUrl}
          title={foods.restaurant.name}
          category={foods.restaurant.category}
          time={foods.restaurant.deliveryTime}
          shipping={foods.restaurant.shipping}
          address={foods.restaurant.address}
        />
      )}

      {isLoadingFoods &&  <CentralizeLoading><CircularProgress color="primary" /></CentralizeLoading>}
      {!isLoadingFoods && errorFoods && <p>Erro</p>}
      {!isLoadingFoods && foods && listFoods}
      {!isLoadingFoods && foods && listFoods.length === 0 && (
        <p>Não há nenhuma postagem</p>
      )}
      <Footer />
    </RestaurantPageContainer>
  );
};

export default RestaurantPage

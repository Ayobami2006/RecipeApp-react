import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import styled from 'styled-components';
import './App.css'

import { 
  Header, 
  AppNameComponent,
  AppIcon, 
  SearchComponent, 
  SearchInput, 
} from './components/headerComponent';

import { RecipeContainer, CoverImage, RecipeName, IngredientText, SeeMoreText } from './components/recipeComponent';


const APP_ID = "62a0aadf";
const APP_KEY = "6ba59178e2975b022c5eca0fcbd82f0f";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 20px;
  justify-content: space-evenly;
`;

const Placeholder = styled.div`
  margin: 100px;
  opacity: 50%;
  text-align: center;
`;

const PlaceholderImg = styled.img`
  height: 170px;
  width: 200px;
`;

const RecipeComponent = (props) => {

  const [show, setShow] = React.useState(false);
  // console.log("props", props);
  const { recipeObj } = props;
  return (
    <>
      <Dialog open={show}>
        <DialogTitle id="alert-dialog-slide-title" >Ingredients</DialogTitle>

        <DialogContent>
          <table>
            <thead>
              <th>Ingredient</th>
              <th>Weight</th>
            </thead>

            <tbody>
              {recipeObj.recipe.ingredients.map((ingredientObj) => (
                <tr>
                  <td>{ingredientObj.text}</td>
                  <td>{ingredientObj.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>

        <DialogActions>
          <IngredientText onClick={()=> window.open(recipeObj.recipe.url)}>See More</IngredientText>
          <SeeMoreText onClick={() => setShow(false)}>Close</SeeMoreText>

        </DialogActions>
      </Dialog>
      <RecipeContainer>
        <CoverImage src={recipeObj.recipe.image} alt="img" />

        <RecipeName>{recipeObj.recipe.label}</RecipeName>

        <IngredientText onClick={() => setShow(true)}>
          Ingredient
        </IngredientText>

        <SeeMoreText onClick={() => window.open(recipeObj.recipe.url)} >
          See complete Recipe
        </SeeMoreText>

      </RecipeContainer>
    </>
  );
};


function App() {

  const [timeoutId, updateTimeoutId] = useState();
  const [recipeList, updateRecipeList] = useState([]);

  const fetchRecipe = async(searchString) => {
    const response = await axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`
    )
    updateRecipeList(response.data.hits);
  };

  const onTextChange = (event) => {
    clearTimeout(timeoutId);
    const timeout = setTimeout(() => fetchRecipe(event.target.value), 500);
    updateTimeoutId(timeout);
  }

  return (
      <Container>
        <Header>
          <AppNameComponent>
            <AppIcon src='/icons8-hamburger-96.png' />
            Recippe Finder
          </AppNameComponent>

          <SearchComponent>
            <img src="/icons8-search.svg" alt="#" />
            <SearchInput placeholder='Search Recipe'
             onChange={onTextChange}
            />
          </SearchComponent>
        </Header>

        <RecipeListContainer>
          {recipeList.length ?
           recipeList.map((recipeObj)=> (
            <RecipeComponent recipeObj={recipeObj} />
          )): (
            <Placeholder>
              <h1>
                Finding and collecting easy recipes for every occasion has never been easier.
                An easy way to learn to make your favorite😊 recipes. ⬇️⬇️
              </h1>
              <h2 className='margin'><em className='font'>Search</em> Your Desire Recipe and see full details on Ingredients & How is Made... 😋</h2>
              <PlaceholderImg src="/icons8-hamburger-96.png" alt='#' />
            </Placeholder>
          )}
        </RecipeListContainer>
      </Container>
  );
}

export default App;

import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


 interface FoodItem {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  available: boolean;
}

interface FoodCards {
  foods: FoodItem[],
  editingFood: FoodItem,
  modalOpen: boolean,
  editModalOpen: boolean,
};


export default function Dashboard() {
  const [foodCards, setFoodCards] = useState<FoodCards>({
    foods: [],
    editingFood: {
      id: 0,
      name: '',
      description: '',
      price: 0,
      available: false,
      image: ''
    },
    modalOpen: false,
    editModalOpen: false,
  });


  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await api.get('foods');

      setFoodCards({ ...foodCards, foods: response.data });
    }

    loadProducts();

  },[foodCards]);


  const handleAddFood = async (food: FoodItem): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoodCards(
        {
          ...foodCards,
          foods: [...foodCards.foods, response.data]
        });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodItem): Promise<void> => {

    try {
      const foodUpdated = await api.put(
        `/foods/${foodCards.editingFood.id}`,
        { ...foodCards.editingFood, ...food },
      );

      const foodsUpdated = foodCards.foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoodCards({ ...foodCards, foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foodCards.foods.filter(food => food.id !== id);

    setFoodCards({ ...foodCards, foods: foodsFiltered });
  }

  const handleEditFood = (food: FoodItem) => {
    setFoodCards({ ...foodCards, editingFood: food, editModalOpen: true });
  }
  
  const toggleModal = () => {
    const isModalOpen = foodCards.modalOpen;
    setFoodCards({ ...foodCards, modalOpen: !isModalOpen });
  }

  const toggleEditModal = () => {
    const isModalOpen = foodCards.editModalOpen;
    setFoodCards({ ...foodCards, editModalOpen: !isModalOpen });
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={foodCards.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={foodCards.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={foodCards.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foodCards.foods &&
          foodCards.foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
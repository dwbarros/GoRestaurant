import { FiEdit3, FiTrash } from 'react-icons/fi';
import { Container } from './styles';
import api from '../../services/api';
import { useState } from 'react';


type FoodItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string
};

interface FoodProps {
  food: FoodItem;
  handleDelete: Function;
  handleEditFood: Function;
};


export default function Food({ food, handleDelete, handleEditFood }: FoodProps) {

  const [currentFood, setCurrentFood] = useState(food);


  const toggleAvailable = async () => {

    await api.put(`/foods/${currentFood.id}`, {
      ...currentFood,
      available: !currentFood.available,
    });

    setCurrentFood({
      ...currentFood,
      available: !currentFood.available,
    });
  }

  const setEditingFood = () => {
    handleEditFood(currentFood);
  }


  return (
    <Container available={currentFood.available}>
      <header>
        <img src={currentFood.image} alt={currentFood.name} />
      </header>

      <section className="body">
        <h2>{currentFood.name}</h2>
        <p>{currentFood.description}</p>
        <p className="price">
          R$ <b>{currentFood.price}</b>
        </p>
      </section>

      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${currentFood.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(currentFood.id)}
            data-testid={`remove-food-${currentFood.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{currentFood.available ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${currentFood.id}`} className="switch">
            <input
              id={`available-switch-${currentFood.id}`}
              type="checkbox"
              checked={currentFood.available}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${currentFood.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
};
import * as API from './api.js';

export const countComments = (comments = []) => comments.length;

const displayCommentsPopup = async ({ mealId, appId }) => {
  const meal = await API.getMealById(mealId);
  const modal = document.querySelector('#modal-content');
  modal.innerHTML = `
    <div class="involvement-container">
      <section>
        <img src='${meal.strMealThumb}' class="meal-image">
        <h2>${meal.strMeal}</h2>
        <ul class="meal-info">
          <li><span class="label">Category:</span> ${meal.strCategory}</li>
          <li><span class="label">Area:</span> ${meal.strArea}</li>
          <li><span class="label">Recipe:</span> <a href='${meal.strSource}' target="blank">Recipe Link</a></li>
          <li><span class="label">Video Instruction:</span> <a href='${meal.strYoutube}' target="blank">YouTube Link</a></li>
        </ul>
      </section>
      <section>
        <h3>Comments (<span id="comment-count">0</span>)</h3>
        <ul id='comment-list'></ul>
      </section>
      <form>
        <h3 class="text-center">Add a comment</h3>
        <input type="text" placeholder='Your name' required>
        <textarea id="text" name="text" rows="4" placeholder="Your insights" required></textarea>
        <button type="submit" class="primary-button">Comment</button>
      </form>
    </div>
   `;

  const renderComments = async () => {
    const comments = await API.getComments(appId, mealId);
    const counter = modal.querySelector('#comment-count');
    counter.innerText = countComments(comments);

    const list = modal.querySelector('#comment-list');
    list.innerHTML = '';

    comments.forEach((involvement) => {
      const li = document.createElement('li');
      li.innerHTML = `${involvement.creation_date} ${involvement.username}: ${involvement.comment}`;
      list.appendChild(li);
    });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
      item_id: mealId,
      username: event.target.children[1].value,
      comment: event.target.children[2].value,
    };
    const isCreated = await API.createComment({
      appId,
      mealId,
      data,
    });

    if (isCreated) {
      await renderComments();
      form.reset();
      event.target.children[1].focus();
    }
  });

  await renderComments();
};

export default displayCommentsPopup;
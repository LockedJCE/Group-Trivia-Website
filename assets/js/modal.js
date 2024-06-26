document.addEventListener('DOMContentLoaded', () => {

    // Get categories from the API
    function dropdownCategories() {
        const categoriesUrl = 'https://opentdb.com/api_category.php';
        fetch(categoriesUrl)
            .then(response => response.json())
            .then(data => {
                const categoryDropdown = $('#category-dropdown');
                data.trivia_categories.forEach(category => {
                    // Create dropdown options
                    categoryDropdown.append($('<option>').val(category.id).text(category.name));
                });
            });
    }

    function dropdownDog() {
      const categoriesUrl = 'https://dog.ceo/api/breeds/list/all';
      fetch(categoriesUrl)
          .then(response => response.json())
          .then(data => {
              const categoryDog = $('#category-dog');
              Object.keys(data.message).forEach(breed => {

                  // If there are sub breeds, add an option for each sub-breed
                  if (data.message[breed].length > 0) {
                      data.message[breed].forEach(subBreed => {
                          categoryDog.append($('<option>').val(`${breed} ${subBreed}`).text(`${breed} ${subBreed}`));
                      });
                  } else {
                      // If there are no sub breeds, just add the breed
                      categoryDog.append($('<option>').val(breed).text(breed));
                  }
              });
          })
    }
    // Fill difficulty dropdown
    function dropdownDifficulties() {
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficultyDropdown = $('#difficulty-dropdown');
    
        difficulties.forEach(difficulty => {
            // Create dropdown options
            difficultyDropdown.append($('<option>').val(difficulty.toLowerCase()).text(difficulty));
        });
    }

    // Call both those functions
    dropdownCategories();
    dropdownDifficulties();
    dropdownDog()


    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape") {
        closeAllModals();
      }
    });
  });
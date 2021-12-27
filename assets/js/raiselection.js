/* RAISELECTION LIBRARY */
let callIndex = 0;
function raiselect(elementClass, settings) {
	function fillField(field, option, index) {
		const fieldItem = document.createElement('p');
		fieldItem.className = 'custom-selection-field__item';
		fieldItem.innerHTML = option.innerHTML;
		fieldItem.dataset.id = index;
		if(settings['removeOnClick']) {
			fieldItem.classList.add('deletable');
			fieldItem.addEventListener('click', function() {
				option.removeAttribute('selected');
				document.getElementById(index).checked = false;
				fieldItem.remove();
			});
		}
		field.append(fieldItem);
	}
	function removeField(field, index) {
		field.querySelector('[data-id="' + index + '"]').remove();
	}

	const selections = document.querySelectorAll(elementClass);
	selections.forEach((select, selectIndex) => {
		// Remove standart select
		select.style.display = 'none';
		// Create container
		const container = document.createElement('div');
		container.className = 'multi-selection-container';
		if(settings['theme'] == 'dark') {
			container.classList.add('dark');
		}
		select.before(container);
		container.append(select);

		// Create field input
		const field = document.createElement('div');
		field.className = 'custom-selection-field';
		field.addEventListener('click', function() {
			field.classList.toggle('active');
		});

		// Create stylized label
		const label = document.createElement('div');
		label.className = 'custom-selection';
		select.querySelectorAll('option').forEach((option, optionIndex) => {
			if(optionIndex == 0 && option.disabled && option.selected) {} else {
				const index = 'raiselect' + callIndex + '_' + selectIndex + '' + optionIndex;
				option.setAttribute('data-id', index);
				// Fill field input
				if(option.selected) {
					fillField(field, option, index);
				}


				const optionContainer = document.createElement("div");
				optionContainer.className = 'custom-selection__input-container';

				const input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'custom-selection__input';
				input.value = option.value;
				input.id = index;
				if(option.selected) {
					input.checked = 'true';
					input.classList.add('checked');
				}
				if(option.disabled) {
					input.disabled = 'true';
					input.classList.add('disabled');
				}
				if(settings['showSelected']) {
					input.addEventListener('change', function() {
						if(input.checked) {
							option.setAttribute('selected', true);
							fillField(field, option, index);
						} else {
							option.removeAttribute('selected');
							removeField(field, index);
						}
					});	
				}
				if(settings['checkboxOrder'] == -1) {
					input.style.display = 'none';
				}

				const title = document.createElement('label');
				title.innerHTML = option.innerHTML;
				title.className = 'custom-selection__title';
				title.htmlFor = index;
				
				if(settings['checkboxOrder'] == 0) {
					optionContainer.append(input, title);
				} else {
					optionContainer.append(title, input);
				}

				label.append(optionContainer);
			}
		});

		const customContainer = document.createElement('div');
		customContainer.className = 'custom-selection-container';

		// Create search
		const search = document.createElement('input');
		search.className = 'custom-selection__search';
		let searchHolder = 'Search...';
		if(select[0].selected && select[0].disabled) {
			searchHolder = select[0].innerHTML;			
		}
		search.placeholder = searchHolder;
		search.addEventListener('input', function() {
			const inputContainers = search.parentNode.parentNode.querySelectorAll('.custom-selection__input-container');
			inputContainers.forEach(inputCont => {
				const inputValue = inputCont.querySelector('.custom-selection__title').innerHTML.toLowerCase();
				const searchValue = search.value.toLowerCase();
				if(inputValue.match(searchValue)) {
					inputCont.classList.remove('hidden');
				} else {
					inputCont.classList.add('hidden');
				}
			});
		});

		function openSearch() {
			label.classList.add('visible');
			const overlay = document.createElement('div');
			overlay.className = 'custom-selection-overlay';
			document.body.append(overlay);
			document.body.style.overflowX = 'hidden';
			search.onfocus = null;
			overlay.addEventListener('click', function() {
				search.onfocus = function() {openSearch()};
				label.classList.remove('visible');
				overlay.remove();
				document.body.style.overflowX = 'auto';
			});
		}
		search.onfocus = function() {
			openSearch();
		}

		customContainer.append(search, field);
		container.append(customContainer, label);
	});
	callIndex++;
}
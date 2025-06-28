let currentSort = {
   column: 'name',
   direction: 'asc'
};
let currentCategory = 'all';
let currentSearch = '';

function initializeCategories() {
   const tbody = document.getElementById('tableBody');
   const rows = tbody.querySelectorAll('tr');
   const categories = new Map();

   rows.forEach(row => {
      const category = row.getAttribute('data-category');
      const color = row.getAttribute('data-color');

      if (category && color && !categories.has(category)) {
         categories.set(category, color);
      }
   });

   const categoryMenu = document.getElementById('categoryDropdownMenu');
   const existingItems = categoryMenu.querySelectorAll('li:not(:first-child)');
   existingItems.forEach(item => item.remove());

   categories.forEach((color, category) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.innerHTML = `<i class='bx bx-circle' style="color: ${color}"></i> ${category}`;
      a.onclick = () => filterByCategory(category);
      li.appendChild(a);
      categoryMenu.appendChild(li);
   });
}

function filterByCategory(category) {
   currentCategory = category;

   const categoryButton = document.getElementById('categoryDropdown');
   categoryButton.innerHTML = `<i class='bx bx-filter'></i> Category: ${category === 'all' ? 'All Categories' : category}`;

   const categoryItems = document.querySelectorAll('#categoryDropdownMenu .dropdown-item');
   categoryItems.forEach(item => item.classList.remove('active'));

   if (category === 'all') {
      document.querySelector('#categoryDropdownMenu .dropdown-item').classList.add('active');
   } else {
      const activeItem = Array.from(categoryItems).find(item => item.textContent.includes(category));
      if (activeItem) activeItem.classList.add('active');
   }

   applyFilters();
   updateActiveFilters();
}

function sortTable(column, direction) {
   const tbody = document.getElementById('tableBody');
   const rows = Array.from(tbody.querySelectorAll('tr'));

   currentSort = {
      column,
      direction
   };

   rows.sort((a, b) => {
      let aVal, bVal;

      if (column === 'name') {
         aVal = a.cells[0].textContent.trim().toLowerCase();
         bVal = b.cells[0].textContent.trim().toLowerCase();
      } else if (column === 'description') {
         aVal = a.cells[1].textContent.trim().toLowerCase();
         bVal = b.cells[1].textContent.trim().toLowerCase();
      }

      if (direction === 'asc') {
         return aVal.localeCompare(bVal);
      } else {
         return bVal.localeCompare(aVal);
      }
   });

   tbody.innerHTML = '';
   rows.forEach(row => tbody.appendChild(row));

   const dropdownButton = document.getElementById('sortDropdown');
   const sortText = column.charAt(0).toUpperCase() + column.slice(1);
   const directionText = direction === 'asc' ? 'A-Z' : 'Z-A';
   dropdownButton.innerHTML = `<i class='bx bx-sort'></i> Sort by: ${sortText} (${directionText})`;

   applyFilters();
}

function applyFilters() {
   const searchInput = document.getElementById('searchInput');
   currentSearch = searchInput.value.toLowerCase();

   const tbody = document.getElementById('tableBody');
   const rows = tbody.querySelectorAll('tr');
   const noResults = document.getElementById('noResults');
   let visibleCount = 0;

   rows.forEach(row => {
      const name = row.cells[0].textContent.toLowerCase();
      const description = row.cells[1].textContent.toLowerCase();
      const category = row.getAttribute('data-category');

      const categoryMatch = currentCategory === 'all' || category === currentCategory;

      const searchMatch = currentSearch === '' ||
         name.includes(currentSearch) ||
         description.includes(currentSearch);

      if (categoryMatch && searchMatch) {
         row.style.display = '';
         visibleCount++;
      } else {
         row.style.display = 'none';
      }
   });

   if (visibleCount === 0) {
      noResults.classList.remove('d-none');
   } else {
      noResults.classList.add('d-none');
   }

   updateActiveFilters();
}

function updateActiveFilters() {
   const activeFiltersContainer = document.getElementById('activeFilters');
   const categoryFilter = document.getElementById('categoryFilter');
   const searchFilter = document.getElementById('searchFilter');

   let hasActiveFilters = false;

   if (currentCategory !== 'all') {
      const row = document.querySelector(`tr[data-category="${currentCategory}"]`);
      const color = row ? row.getAttribute('data-color') : '#6c757d';

      categoryFilter.style.display = 'inline-flex';
      categoryFilter.style.backgroundColor = color;
      document.getElementById('categoryFilterText').textContent = currentCategory;
      hasActiveFilters = true;
   } else {
      categoryFilter.style.display = 'none';
   }

   if (currentSearch !== '') {
      searchFilter.style.display = 'inline-flex';
      document.getElementById('searchFilterText').textContent = `"${currentSearch}"`;
      hasActiveFilters = true;
   } else {
      searchFilter.style.display = 'none';
   }

   activeFiltersContainer.style.display = hasActiveFilters ? 'block' : 'none';
}

function clearSearch() {
   document.getElementById('searchInput').value = '';
   currentSearch = '';
   applyFilters();
}

document.addEventListener('DOMContentLoaded', function () {
   initializeCategories();
   sortTable('name', 'asc');
   updateActiveFilters();
});
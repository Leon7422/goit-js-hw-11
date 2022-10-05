import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import PhotosApi from './API.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const photoApi = new PhotosApi();

const form = document.querySelector('.search-form');
const morePhotosbtn = document.querySelector('.load-more');
form.addEventListener('submit', getPhotos);
morePhotosbtn.addEventListener('click', getMorePhotos);
let lightbox;

async function getPhotos(e) {
  const loadMore = document.querySelector('.load-more');
  const gallery = document.querySelector('.gallery');
  const input = document.querySelector('[name="searchQuery"]');
  e.preventDefault();

  photoApi.query = input.value;
  gallery.innerHTML = '';
  photoApi.resetPage();
  const data = await photoApi.getPhotos();
  if (data.data.hits.length === 0) {
    loadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  console.log(data);
  Notiflix.Notify.success(`Hooray! We found ${data.data.total} images.`);
  createMarkup(data);
  lightbox = new SimpleLightbox('.gallery a');
  loadMore.classList.remove('is-hidden');
}

async function getMorePhotos(e) {
  const loadMore = document.querySelector('.load-more');
  loadMore.setAttribute('disabled', '');
  const data = await photoApi.getPhotos();
  createMarkup(data);
  lightbox.refresh();
  loadMore.removeAttribute('disabled');

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.7,
    behavior: 'smooth',
  });
}

function createMarkup(data) {
  const gallery = document.querySelector('.gallery');
  // ${image.webformatURL}
  const photos = data.data.hits
    .map(image => {
      return `<a class="gallery__item" href="${image.largeImageURL}"><div class="photo-card">
  <img class="image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b><span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b><span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments: </b><span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads: </b><span>${image.downloads}</span>
    </p>
  </div>
</div></a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', photos);
}

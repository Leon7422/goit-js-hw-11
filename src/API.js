import axios from 'axios';
export default class PhotoApiService {
  constructor() {
    this.searchQuerry = '';
    this.page = 1;
  }

  async getPhotos() {
    const input = document.querySelector('[name="searchQuery"]');

    const config = {
      params: {
        key: '30379658-c35fb17314acd2b2cacdcf3a4',
        q: this.searchQuerry,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    };

    const data = await axios.get('https://pixabay.com/api/', config);
    if (data.data.hits.length !== 0) {
      this.page += 1;
    }
    return data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuerry;
  }

  set query(newQuerry) {
    this.searchQuerry = newQuerry;
  }
}

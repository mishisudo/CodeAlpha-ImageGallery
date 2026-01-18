/* script.js */

// 1. Image Data (Simulated)
const images = [
    { id: 1, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', category: 'nature', title: 'Misty Mountains' },
    { id: 2, src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e', category: 'architecture', title: 'Modern Building' },
    { id: 3, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', category: 'nature', title: 'Deep Forest' },
    { id: 4, src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e', category: 'architecture', title: 'Creative Design' },
    { id: 5, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', category: 'nature', title: 'Open Field' },
    { id: 6, src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', category: 'nature', title: 'Horse Riding' },
    { id: 7, src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', category: 'architecture', title: 'Corner Building' },
    { id: 8, src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07', category: 'nature', title: 'Dark Woods' },
];

// 2. State & DOM Elements
let currentIndex = 0;
let filteredImages = [...images]; // Stores currently visible images
const galleryContainer = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');

// 3. Render Gallery
function renderGallery(items) {
    galleryContainer.innerHTML = items.map((img, index) => `
        <div class="gallery-item" data-id="${img.id}" role="button" tabindex="0" aria-label="View ${img.title}">
            <img src="${img.src}?auto=format&fit=crop&w=600&q=80" alt="${img.title}" loading="lazy">
        </div>
    `).join('');
}

// Initial Render
renderGallery(images);

// 4. Filtering Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Toggle active class
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');

        // Filter data
        const cat = e.target.dataset.category;
        filteredImages = cat === 'all' 
            ? images 
            : images.filter(img => img.category === cat);
        
        renderGallery(filteredImages);
    });
});

// 5. Lightbox Functions
const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Disable background scroll
    lightbox.focus(); // Trap focus (basic)
};

const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Enable background scroll
};

const updateLightboxContent = () => {
    const img = filteredImages[currentIndex];
    lightboxImg.src = `${img.src}?auto=format&fit=crop&w=1200&q=80`; // High-res url
    caption.textContent = `${img.title} (${currentIndex + 1} / ${filteredImages.length})`;
};

const showNext = () => {
    currentIndex = (currentIndex + 1) % filteredImages.length; // Loop to start
    updateLightboxContent();
};

const showPrev = () => {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length; // Loop to end
    updateLightboxContent();
};

// 6. Event Listeners

// Event Delegation for Gallery Items
galleryContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
        // Find the index of the clicked item within the *filtered* list
        const id = parseInt(item.dataset.id);
        const index = filteredImages.findIndex(img => img.id === id);
        if (index !== -1) openLightbox(index);
    }
});

// Lightbox Controls
document.getElementById('close-btn').addEventListener('click', closeLightbox);
document.getElementById('next-btn').addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
document.getElementById('prev-btn').addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

// Close on Click Outside Image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

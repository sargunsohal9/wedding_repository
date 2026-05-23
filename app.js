/**
 * app.js - Logic for the Wedding Media Repository
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Hero Background
    if (CONFIG && CONFIG.HERO_IMAGE) {
        const updateHeroImage = () => {
            const isMobile = window.innerWidth <= 768;
            let heroUrl = (isMobile && CONFIG.HERO_IMAGE_MOBILE) ? CONFIG.HERO_IMAGE_MOBILE : CONFIG.HERO_IMAGE;
            const fileMatch = heroUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
            if (fileMatch) {
                heroUrl = `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w2500`;
            }
            document.querySelector('.hero').style.backgroundImage = `url('${heroUrl}')`;
        };
        
        updateHeroImage();
        window.addEventListener('resize', updateHeroImage);
    }

    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Helper to extract Drive Folder ID from a full sharing link
    window.extractDriveId = function (link) {
        if (!link) return null;
        const folderMatch = link.match(/\/folders\/([a-zA-Z0-9-_]+)/);
        if (folderMatch) return folderMatch[1];
        const fileMatch = link.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (fileMatch) return fileMatch[1];
        // Assume it's an ID if no slash is present
        if (!link.includes('/')) return link;
        return null;
    };

    // 2. Build Navigation Dynamically from CONFIG.TABS
    const dynamicNav = document.getElementById('dynamic-nav');

    if (CONFIG && CONFIG.TABS) {
        CONFIG.TABS.forEach(tab => {
            // Create Dropdown wrapper
            const li = document.createElement('li');
            li.className = 'dropdown';

            // Create Dropdown button
            const aBtn = document.createElement('a');
            aBtn.href = '#';
            aBtn.className = 'dropbtn';
            aBtn.innerHTML = `${tab.name} &#9662;`;
            li.appendChild(aBtn);

            // Create Dropdown content container
            const divContent = document.createElement('div');
            divContent.className = 'dropdown-content';

            // Add items
            if (tab.items && tab.items.length > 0) {
                tab.items.forEach(item => {
                    const aItem = document.createElement('a');
                    aItem.href = '#';
                    aItem.textContent = item.title;
                    aItem.onclick = (e) => {
                        e.preventDefault();
                        loadMediaView(item, tab.name);
                    };
                    divContent.appendChild(aItem);
                });
            }

            li.appendChild(divContent);
            dynamicNav.appendChild(li);
        });
    }

    // 3. View Management
    window.showHome = function () {
        document.body.className = 'theme-default';
        document.getElementById('home-view').classList.add('active');
        document.getElementById('media-view').classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('media-container').innerHTML = '';
    };

    function loadMediaView(item, tabName) {
        document.body.className = "theme-default";
        
        document.getElementById('home-view').classList.remove('active');
        const mediaView = document.getElementById('media-view');
        mediaView.classList.add('active');

        document.getElementById('media-title').textContent = item.title;
        document.getElementById('media-subtitle').textContent = tabName;

        const container = document.getElementById('media-container');
        container.innerHTML = '<div class="loading-state">Loading media...</div>';

        window.scrollTo({ top: mediaView.offsetTop - 80, behavior: 'smooth' });

        renderItem(item, container);
    }

    // 4. Dynamic Renderer & Recursive Fetcher

    async function fetchDriveFilesRecursive(folderId, mimeTypeStr, apiKey) {
        let allFiles = [];
        try {
            // Fetch files matching the requested mimeType (e.g. 'image/' or 'video/')
            const fileUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'${mimeTypeStr}'&key=${apiKey}&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=1000`;
            const fileRes = await fetch(fileUrl);
            const fileData = await fileRes.json();
            if (fileData.files) allFiles = allFiles.concat(fileData.files);

            // Fetch any sub-folders
            const folderUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id)&pageSize=1000`;
            const folderRes = await fetch(folderUrl);
            const folderData = await folderRes.json();

            if (folderData.files && folderData.files.length > 0) {
                // Recursively fetch files from sub-folders
                for (const sub of folderData.files) {
                    const subFiles = await fetchDriveFilesRecursive(sub.id, mimeTypeStr, apiKey);
                    allFiles = allFiles.concat(subFiles);
                }
            }
        } catch (e) {
            console.error('Error fetching drive folder recursively', e);
        }
        return allFiles;
    }

    async function renderItem(item, container) {
        let html = '';

        // Support infinite links dynamically (link, link_2, link_100)
        let links = [];
        Object.keys(item).forEach(key => {
            if (key.startsWith('link')) {
                if (item[key]) links.push(item[key]);
            }
        });
        if (item.links && Array.isArray(item.links)) links = links.concat(item.links);

        if (links.length === 0) links = [""]; // Fallback

        if (item.type === 'youtube') {
            links.forEach(rawLink => {
                let embedUrl = rawLink;
                if (embedUrl.includes('watch?v=')) {
                    const videoId = new URL(embedUrl).searchParams.get('v');
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
                }
                html += `
                    <div class="video-wrapper">
                        <iframe src="${embedUrl}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div style="text-align: center; margin-top: -1.5rem; margin-bottom: 3rem;">
                        <a href="${rawLink}" target="_blank" style="color: var(--text-muted); text-decoration: underline; font-size: 0.9rem;">(Click here to watch directly on YouTube if the player above is blocked)</a>
                    </div>
                `;
            });
            container.innerHTML = html;

        } else if (item.type === 'google_drive_video') {
            const folderIds = links.map(link => window.extractDriveId(link)).filter(Boolean);

            if (!CONFIG.GOOGLE_DRIVE_API_KEY || CONFIG.GOOGLE_DRIVE_API_KEY === 'YOUR_API_KEY_HERE') {
                links.forEach(link => {
                    html += `
                        <p class="section-description" style="margin-top:2rem;">(Mock) Phone Videos from Google Drive</p>
                        <div class="video-wrapper" style="max-width: 400px; margin: 0 auto;">
                            <video controls preload="metadata">
                                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } else {
                let allFiles = [];
                for (const folderId of folderIds) {
                    const files = await fetchDriveFilesRecursive(folderId, 'video/', CONFIG.GOOGLE_DRIVE_API_KEY);
                    allFiles = allFiles.concat(files);
                }

                const uniqueFilesMap = new Map();
                allFiles.forEach(file => {
                    if (!uniqueFilesMap.has(file.name)) {
                        uniqueFilesMap.set(file.name, file);
                    }
                });
                const uniqueFiles = Array.from(uniqueFilesMap.values()).reverse(); // Reverse order

                if (uniqueFiles.length === 0) {
                    container.innerHTML = `<div class="loading-state">No videos found or folders are not public.</div>`;
                    return;
                }

                html = '<div class="masonry-grid">';
                uniqueFiles.forEach(file => {
                    const previewUrl = `https://drive.google.com/file/d/${file.id}/preview`;
                    html += `
                        <div class="video-item">
                            <p style="text-align: center; color: var(--gold); margin-bottom: 0.5rem; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${file.name}">${file.name}</p>
                            <div class="video-wrapper" style="margin-bottom: 0;">
                                <iframe src="${previewUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            }

        } else if (item.type === 'google_drive_photo') {
            const folderIds = links.map(link => window.extractDriveId(link)).filter(Boolean);

            if (!CONFIG.GOOGLE_DRIVE_API_KEY || CONFIG.GOOGLE_DRIVE_API_KEY === 'YOUR_API_KEY_HERE') {
                // Mock data fallback if API key is not yet provided
                await new Promise(resolve => setTimeout(resolve, 800));
                const mockPhotos = [
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop',
                ];

                window.currentGalleryPhotos = mockPhotos.map(url => ({ src: url, download: url, name: 'Mock Photo' }));

                html = '<p style="text-align:center; color:#aaaaaa; margin-bottom:2rem;">(Showing mock data because Google Drive API Key is not configured yet)</p>';
                html += '<div class="masonry-grid">';
                mockPhotos.forEach((url, index) => {
                    html += `
                        <div class="photo-item" onclick="window.openLightboxWrapper(${index})">
                            <img src="${url}" alt="Wedding moment">
                        </div>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            } else {
                let allFiles = [];
                for (const folderId of folderIds) {
                    const files = await fetchDriveFilesRecursive(folderId, 'image/', CONFIG.GOOGLE_DRIVE_API_KEY);
                    allFiles = allFiles.concat(files);
                }

                const uniqueFilesMap = new Map();
                allFiles.forEach(file => {
                    if (!uniqueFilesMap.has(file.name)) {
                        uniqueFilesMap.set(file.name, file);
                    }
                });
                const uniqueFiles = Array.from(uniqueFilesMap.values()).reverse(); // Reverse order

                if (uniqueFiles.length === 0) {
                    container.innerHTML = `<div class="loading-state">No photos found or folders are not public.</div>`;
                    return;
                }

                window.currentGalleryPhotos = uniqueFiles.map(file => {
                    const imgUrl = file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s800') : '';
                    return {
                        src: imgUrl,
                        download: file.webContentLink || imgUrl,
                        name: file.name
                    };
                });

                html = '<div class="masonry-grid">';
                uniqueFiles.forEach((file, index) => {
                    const imgUrl = file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s800') : '';
                    html += `
                        <div class="photo-item" onclick="window.openLightboxWrapper(${index})">
                            <img src="${imgUrl}" alt="${file.name}">
                        </div>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            }

        } else if (item.type === 'image') {
            links.forEach(link => {
                html += `
                    <div style="text-align: center; max-width: 800px; margin: 0 auto; margin-bottom: 2rem;">
                        <img src="${link || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop'}" alt="${item.title}" style="width: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    </div>
                `;
            });
            container.innerHTML = html;

        } else if (item.type === 'pdf') {
            links.forEach(link => {
                html += `
                    <div class="video-wrapper" style="padding-bottom: 120%;">
                        <iframe src="${link || ''}" title="${item.title}" frameborder="0" style="width:100%; height:100%;"></iframe>
                    </div>
                `;
            });
            container.innerHTML = html;

        } else {
            container.innerHTML = `<div class="loading-state">Unsupported media type.</div>`;
        }
    }

    // 5. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxDownload = document.getElementById('lightbox-download');

    let currentPhotoIndex = 0;

    window.openLightboxWrapper = function (index) {
        if (typeof index === 'string') {
            // Fallback for single images
            lightboxImg.src = arguments[0];
            lightboxDownload.href = arguments[1] || arguments[0];
        } else {
            currentPhotoIndex = index;
            updateLightboxContent();
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function updateLightboxContent() {
        if (!window.currentGalleryPhotos || window.currentGalleryPhotos.length === 0) return;
        const photo = window.currentGalleryPhotos[currentPhotoIndex];
        lightboxImg.src = photo.src;
        lightboxDownload.href = photo.download;
    }

    document.getElementById('lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.currentGalleryPhotos && window.currentGalleryPhotos.length > 0) {
            currentPhotoIndex = (currentPhotoIndex - 1 + window.currentGalleryPhotos.length) % window.currentGalleryPhotos.length;
            updateLightboxContent();
        }
    });

    document.getElementById('lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.currentGalleryPhotos && window.currentGalleryPhotos.length > 0) {
            currentPhotoIndex = (currentPhotoIndex + 1) % window.currentGalleryPhotos.length;
            updateLightboxContent();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
            if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
        }
    });
});

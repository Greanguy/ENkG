window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Synchronized video playback for ablation study comparisons
function setupSyncedVideoPlayback() {
    // Helper function to sync two videos
    function syncVideos(video1, video2, playbackRate = 1.0) {
        if (!video1 || !video2) return;
        
        // Set playback rate (fps control)
        video1.playbackRate = playbackRate;
        video2.playbackRate = playbackRate;
        
        video1.addEventListener('play', function() {
            video2.play();
        });
        video1.addEventListener('pause', function() {
            video2.pause();
        });
        video1.addEventListener('timeupdate', function() {
            if (Math.abs(video1.currentTime - video2.currentTime) > 0.5) {
                video2.currentTime = video1.currentTime;
            }
        });
        
        video2.addEventListener('play', function() {
            video1.play();
        });
        video2.addEventListener('pause', function() {
            video1.pause();
        });
        video2.addEventListener('timeupdate', function() {
            if (Math.abs(video2.currentTime - video1.currentTime) > 0.5) {
                video1.currentTime = video2.currentTime;
            }
        });
    }
    
    // Teaser long-horizon comparisons (with 5 fps playback rate)
    const long12Base = document.getElementById('long-12-base');
    const long12Ours = document.getElementById('long-12-ours');
    const long16Base = document.getElementById('long-16-base');
    const long16Ours = document.getElementById('long-16-ours');
    const long30Base = document.getElementById('long-30-base');
    const long30Ours = document.getElementById('long-30-ours');
    
    // Sync teaser videos with 5 fps playback (assuming original is ~30fps, 5/30 ≈ 0.167)
    syncVideos(long12Base, long12Ours, 0.167);
    syncVideos(long16Base, long16Ours, 0.167);
    syncVideos(long30Base, long30Ours, 0.167);
    
    // Results carousel comparisons (with normal 30 fps playback rate)
    const drivingworldK30 = document.getElementById('drivingworld-k30');
    const drivingworldOurs = document.getElementById('drivingworld-ours');
    const vavimGreedy = document.getElementById('vavim-greedy');
    const vavimOurs = document.getElementById('vavim-ours');
    const cosmosTopp = document.getElementById('cosmos-topp');
    const cosmosOurs = document.getElementById('cosmos-ours');
    
    // Sync results videos with normal playback (30 fps, playbackRate = 1.0)
    syncVideos(drivingworldK30, drivingworldOurs);
    syncVideos(vavimGreedy, vavimOurs);
    syncVideos(cosmosTopp, cosmosOurs);
    
    // Entropy-adaptive guidance comparison
    const entropyWoentropy = document.getElementById('entropy-woentropy');
    const entropyOurs = document.getElementById('entropy-ours');
    
    // k-Guard comparison
    const kguardWokguard = document.getElementById('kguard-wokguard');
    const kguardOurs = document.getElementById('kguard-ours');
    
    // Setup ablation study comparisons sync (normal playback rate)
    syncVideos(entropyWoentropy, entropyOurs);
    syncVideos(kguardWokguard, kguardOurs);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    
    // Setup synchronized video playback for ablation study
    setupSyncedVideoPlayback();

})

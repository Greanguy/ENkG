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
    
    // Teaser long-horizon comparisons (with faster playback for better viewing)
    const long1Base = document.getElementById('long-1-base');
    const long1Ours = document.getElementById('long-1-ours');
    const long3Base = document.getElementById('long-3-base');
    const long3Ours = document.getElementById('long-3-ours');
    const long5Base = document.getElementById('long-5-base');
    const long5Ours = document.getElementById('long-5-ours');
    const long8Base = document.getElementById('long-8-base');
    const long8Ours = document.getElementById('long-8-ours');
    const long12Base = document.getElementById('long-12-base');
    const long12Ours = document.getElementById('long-12-ours');
    const long16Base = document.getElementById('long-16-base');
    const long16Ours = document.getElementById('long-16-ours');
    const long22Base = document.getElementById('long-22-base');
    const long22Ours = document.getElementById('long-22-ours');
    const long30Base = document.getElementById('long-30-base');
    const long30Ours = document.getElementById('long-30-ours');
    const long32Base = document.getElementById('long-32-base');
    const long32Ours = document.getElementById('long-32-ours');
    const long36Base = document.getElementById('long-36-base');
    const long36Ours = document.getElementById('long-36-ours');
    const long38Base = document.getElementById('long-38-base');
    const long38Ours = document.getElementById('long-38-ours');
    
    // Sync all teaser long videos with 1.5x playback speed
    syncVideos(long1Base, long1Ours, 1.5);
    syncVideos(long3Base, long3Ours, 1.5);
    syncVideos(long5Base, long5Ours, 1.5);
    syncVideos(long8Base, long8Ours, 1.5);
    syncVideos(long12Base, long12Ours, 1.5);
    syncVideos(long16Base, long16Ours, 1.5);
    syncVideos(long22Base, long22Ours, 1.5);
    syncVideos(long30Base, long30Ours, 1.5);
    syncVideos(long32Base, long32Ours, 1.5);
    syncVideos(long36Base, long36Ours, 1.5);
    syncVideos(long38Base, long38Ours, 1.5);
    
    // Results carousel comparisons (with normal playback rate)
    const drivingworldK30 = document.getElementById('drivingworld-k30');
    const drivingworldOurs = document.getElementById('drivingworld-ours');
    const vavimGreedy = document.getElementById('vavim-greedy');
    const vavimOurs = document.getElementById('vavim-ours');
    const cosmosTopp = document.getElementById('cosmos-topp');
    const cosmosOurs = document.getElementById('cosmos-ours');
    
    // Sync results videos with normal playback (1.0x)
    syncVideos(drivingworldK30, drivingworldOurs, 1.0);
    syncVideos(vavimGreedy, vavimOurs, 1.0);
    syncVideos(cosmosTopp, cosmosOurs, 1.0);
    
    // Entropy-adaptive guidance comparison (1.5x speed)
    const entropyWoentropy = document.getElementById('entropy-woentropy');
    const entropyOurs = document.getElementById('entropy-ours');
    
    // k-Guard comparison (1.5x speed)
    const kguardWokguard = document.getElementById('kguard-wokguard');
    const kguardOurs = document.getElementById('kguard-ours');
    
    // Setup ablation study comparisons sync with 1.5x playback rate
    syncVideos(entropyWoentropy, entropyOurs, 1.5);
    syncVideos(kguardWokguard, kguardOurs, 1.5);
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

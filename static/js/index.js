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

// Enable autoplay for all videos and sync paired comparisons
function setupSyncedVideoPlayback() {
    function isTeaserVideo(video) {
        return video.classList.contains('teaser-video');
    }

    function getTargetPlaybackRate(video) {
        return isTeaserVideo(video) ? 1.0 : 3.0;
    }

    function applyAutoplayDefaults(video) {
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
    }

    function syncVideos(video1, video2) {
        if (!video1 || !video2) return;

        const playbackRate = getTargetPlaybackRate(video1);
        video1.playbackRate = playbackRate;
        video2.playbackRate = playbackRate;

        let isSyncing = false;
        const syncTime = (source, target) => {
            if (isSyncing) return;
            if (Math.abs(source.currentTime - target.currentTime) > 0.15) {
                isSyncing = true;
                target.currentTime = source.currentTime;
                isSyncing = false;
            }
        };

        video1.addEventListener('play', function() {
            if (video2.paused) video2.play().catch(() => {});
        });
        video2.addEventListener('play', function() {
            if (video1.paused) video1.play().catch(() => {});
        });
        video1.addEventListener('pause', function() {
            if (!video2.paused) video2.pause();
        });
        video2.addEventListener('pause', function() {
            if (!video1.paused) video1.pause();
        });
        video1.addEventListener('timeupdate', function() {
            syncTime(video1, video2);
        });
        video2.addEventListener('timeupdate', function() {
            syncTime(video2, video1);
        });
        video1.addEventListener('seeking', function() {
            syncTime(video1, video2);
        });
        video2.addEventListener('seeking', function() {
            syncTime(video2, video1);
        });
    }

    const comparisons = document.querySelectorAll('.video-comparison');
    comparisons.forEach((comparison) => {
        const videos = comparison.querySelectorAll('video');
        if (videos.length === 2) {
            syncVideos(videos[0], videos[1]);
        }
    });

    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video) => {
        applyAutoplayDefaults(video);
        video.playbackRate = getTargetPlaybackRate(video);
        video.play().catch(() => {});
    });
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

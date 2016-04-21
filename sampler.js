var Sampler = ( function() {
	var settings = {
		samples: { 
			'808': {
				0: 'bass.mp3'
			}
		},
		bpm:           110,
		isPlaying:     false,
		isLoaded:      false,
		sequence:      [0,1,2,3]
	}
	
	var init = function() {
		console.log( 'sampler.init()' );							

		bindEventHandlers();
		initSampler();
		initPlayback();		
	}
	
	var bindEventHandlers = function() {
		console.log( 'sampler.bindEventHandlers()' );  
		
		$( document )
			.on( 'sampler/loaded', function() {
				console.log( 'All samples are loaded' );				
				settings.isLoaded = true;	

				togglePlayback();				
			} )
			.on( 'keyup', function( event ) {
				var key = event.which;

				// toggle playback
				// Space
				if( key === 32 ) {
					togglePlayback();
				}			       
			} );

		Tone.Buffer.on( 'load', function() {
			$( document ).trigger( 'sampler/loaded' );
		} );   
	}
	
	var initSampler = function() {
		console.log( 'sampler.initSampler()' );
				
		settings.sampler = new Tone.Sampler(
			settings.samples
		).toMaster();
	}

	var playSample = function() {
		console.log( 'sampler.playSample()' );

		if( settings.isLoaded ) {
			settings.sampler.triggerAttack( '808.0' ); 
		}
	}	
	
	var initPlayback = function() {
		console.log( 'sampler.initPlayback()' );
			 				 
		Tone.Transport.bpm.value = settings.bpm;  
		settings.loop = new Tone.Sequence( function( time, note ) {				
			if( settings.sequence[note] !== undefined ) {
				playSample();			
			}
		}, [0,1,2,3], '4n' );

		Tone.Transport.start();    
	}
	
	var togglePlayback = function() {
		console.log( 'sampler.togglePlayback()' );

		if( settings.isPlaying ) {
			settings.isPlaying = false;	 
			settings.loop.stop();
		} else {
			settings.isPlaying = true;		
			settings.loop.start();
		}		
	}
	
	return {
		init: function() { init(); }
	}
} )();


$( document ).ready( function() {
	 Sampler.init();
} );
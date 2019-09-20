// taken from https://stackoverflow.com/questions/21277900/javascript-pausing-setinterval (user colxi)

export function Timer(_fn_callback_, _timer_freq_){
    let RESUME_CORRECTION_RATE = 2;

    let _timer_statusCode_;
    let _timer_clockRef_;

    let _time_ellapsed_;        // will store the total time ellapsed
    let _time_pause_;           // stores the time when timer is paused
    let _time_lastCycle_;       // stores the time of the last cycle

    let _isCorrectionCycle_;
    
    let _hasStarted;
 
    /**
     * execute in each clock cycle
     */
    const nextCycle = function(){
        // calculate deltaTime
        let _time_delta_        = new Date() - _time_lastCycle_;
        _time_lastCycle_    = new Date();
        _time_ellapsed_   += _time_delta_;

        // if its a correction cicle (caused by a pause,
        // destroy the temporary timeout and generate a definitive interval
        if( _isCorrectionCycle_ ){
            clearTimeout( _timer_clockRef_ );
            clearInterval( _timer_clockRef_ );
            _timer_clockRef_    = setInterval(  nextCycle , _timer_freq_  );
            _isCorrectionCycle_ = false;
        }
        // execute callback
        _fn_callback_.apply( timer, [ timer ] );
    };

  

    // timer public API
    const timer = {
        get statusCode(){ return _timer_statusCode_ },
        get timestamp(){
            let abstime;
            if( _timer_statusCode_=== 1 ) abstime = _time_ellapsed_ + ( new Date() - _time_lastCycle_ );
            else if( _timer_statusCode_=== 2 ) abstime = _time_ellapsed_ + ( _time_pause_ - _time_lastCycle_ );
            return abstime || 0;
        },

        start: function() {
            _time_ellapsed_     = 0;
            _time_lastCycle_     = new Date();
            _timer_statusCode_   = 1;
            _timer_clockRef_     = setInterval(  nextCycle , _timer_freq_  );
            _hasStarted = true;
        },

        hasStarted: function() {
            return _hasStarted;
        },

        pause : function(){
            if( _timer_statusCode_ !== 1 ) return this;
            // stop timers
            clearTimeout( _timer_clockRef_ );
            clearInterval( _timer_clockRef_ );
            // set new status and store current time, it will be used on
            // resume to calculate how much time is left for next cycle
            // to be triggered
            _timer_statusCode_ = 2;
            _time_pause_       = new Date();
            return this;
        },

        resume: function(){
            if( _timer_statusCode_ !== 2 ) return this;
            _timer_statusCode_  = 1;
            _isCorrectionCycle_ = true;
            const delayEllapsedTime = _time_pause_ - _time_lastCycle_;
            _time_lastCycle_    = new Date( new Date() - (_time_pause_ - _time_lastCycle_) );

            _timer_clockRef_ = setTimeout(  nextCycle , _timer_freq_ - delayEllapsedTime - RESUME_CORRECTION_RATE);

            return this;
        } 
    };
    return timer;
};


let myTimer = Timer( x=> console.log(x.timestamp), 1000);
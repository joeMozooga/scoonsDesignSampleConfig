
!function($){

    var defaults = {
        dataFile: 'json/samples.json',
        initCallback: function(){}
    };
    
    var SampleConfigurator = function(el, options){
        this.$el = $(el);
        this.$sampler = '';
        this.$sampleHeader = '';
        this.$sampleBoardOptions = '';
        this.$sampleBoard = '';
        this.$sampleList = '';
        this.$listPreview = '';
        this.$isDragging = false;
        this.$isMouseDown = false;
        this.sampleList = {};
        this.boardList = {};
        
        if (!this.$el.length)
            throw new Error('You must bind Sample Configurator on an existing element.');
        
        return this.init(options);
    };
    SampleConfigurator.prototype = {
        init: function(options){
            this.__class__ = 'SampleConfigurator';
            this.__version__ = '0.1';
            
            this.settings = $.extend( {}, defaults, options );
            
            console.log(this.settings.dataFile);
            $.getJSON( this.settings.dataFile, $.proxy(function( data ) {
                this.setupConfigurator();
                this.addSamples(data.samples);
                this.addBoards(data.boards);
                
                //Set board layout
                this.setBoardLayout(2, 3);
                this.setupEvents();
                
                //Callback after instantiation
                this.settings.initCallback();
            },this));
            
            return this;
        },
        setupConfigurator: function(){
            this.$el.append('<div class="sample-config"><div class="sample-container"><div class="sample-header"></div><div class="sample-board-container"></div></div><div class="sample-list-container"><div class="sample-list-header"><p>Select a Sample</p></div><div class="sample-list"><ul></ul></div></div></div>');
            this.$sampler = this.$el.find('.sample-config');
            this.$sampler.height($(window).height());
            
            //Header
            this.$sampleHeader = this.$sampler.find('.sample-header');
            this.$sampleHeader.append('<div class="sample-header-text">Select A Sample Board:</div><div class="board-options"><ul></ul></div>');
            this.$sampleBoardOptions = this.$sampleHeader.find('.board-options');
            
            this.$sampleBoard = this.$sampler.find('.sample-board-container');
            //this.$samplerBoard.append('<div class="board"><div class="board-row"><div class="board-cell"></div><div class="board-cell"></div><div class="board-cell"></div></div><div class="board-row"><div class="board-cell"></div><div class="board-cell"></div><div class="board-cell"></div></div></div>');
            
            this.$sampleList = this.$sampler.find('.sample-list');
            this.$listPreview = $('<div class="sample-preview"><div class="preview-container"><div class="image-preview"></div><div class="info-preview"><div class="title"></div><div class="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div></div></div></div>')
            this.$sampleList.parent().append(this.$listPreview);
            //Add sample listStyleType
            
        },
        setupEvents: function(){
            this.$sampler.find('.sample-item').mouseover($.proxy(function(e){
                
                $target = $(e.currentTarget);
                var targetHeight = $target.height();
                var previewHeight = this.$listPreview.height();
                var targetO = $target.offset();
                var previewO = this.$listPreview.offset();
                var samplerTop = this.$sampler.offset().top;
                var samplerBottom = this.$sampler.offset().top + this.$sampler.height()
                var borderPositionPadding = 5;
                
                //Get sample info
                var id = $target.attr('sampleID');
                
                //Set preview content
                this.$listPreview.find('.image-preview').css({backgroundImage:'url("images/samples/'+this.sampleList[id].image+'")'});
                this.$listPreview.find('.title').text(this.sampleList[id].name);
                //this.$listPreview.find('.description').text(this.sampleList[id].description);
                
                previewO.top = targetO.top + (targetHeight/2) - (previewHeight/2);
                if (previewO.top < samplerTop + borderPositionPadding) previewO.top = samplerTop + borderPositionPadding;
                if (previewO.top+previewHeight > samplerBottom - borderPositionPadding) previewO.top -= (previewO.top + previewHeight) - samplerBottom + borderPositionPadding;
                
                //Set preview postion and show
                this.$listPreview.offset(previewO);
                this.$listPreview.show();
                
            },this))
            
            this.$sampleList.mouseleave($.proxy(function(e){
                this.$listPreview.hide();
            },this));
            
            $('.sample-item').mousedown($.proxy(function(event){
                this.isMouseDown = true;
                
                //deselect text
                event.preventDefault();
                document.getSelection().removeAllRanges();
                
                //Get the target sample
                $target = $(event.currentTarget);
                
                //Get sample info
                var id = $target.attr('sampleID');
                
                //Create draggable element
                var $dragSample = $('<div class="drag-sample"><img src="images/samples/'+this.sampleList[id].image+'" /></div>');
                $dragSample.css({top: (event.pageY-50).toString()+'px', left: (event.pageX-50).toString()+'px', pointerEvents: 'none'});
                $('body').append($dragSample);
                
                //Move element
                $('body').mousemove($.proxy(function(e){
                    if(this.isMouseDown){
                        $dragSample.css({top: (e.pageY-50).toString()+'px', left: (e.pageX-50).toString()+'px'});
                    }
                },this));
                
                this.$sampler.find('.board-cell').mouseenter($.proxy(function(e){
                    //Reset all cell backgrouns
                    this.$sampler.find('.board-cell').each($.proxy(function(i, o){
                        var $o = $(o);
                        console.log(i);
                        console.log(o);
                        if($o.attr('id') != $(e.currentTarget).attr('id'))
                            $o.css({backgroundImage:'url("images/samples/'+$o.attr('previmage')+'")'});
                    },this));
                    
                    //Set new cell background
                    $(e.currentTarget).css({backgroundImage:'url("images/samples/'+this.sampleList[id].image+'")'});
                },this))
                
                this.$sampler.find('.board-cell').mouseleave($.proxy(function(e){
                    if(!this.insideBoardCell(e.pageY-50, e.pageX-50)) 
                        $(e.currentTarget).css({backgroundImage:'url("images/samples/'+$(e.currentTarget).attr('previmage')+'")'});
                },this));
                //*/
                
                this.$sampler.find('.board-cell').mouseup($.proxy(function(e){
                    var $cell = $(e.currentTarget);
                    $cell.find('p.drag-text').remove();
                    $cell.attr('previmage', this.sampleList[id].image);
                    this.$sampler.find('.board-cell').each($.proxy(function(i, o){
                        var $o = $(o);
                        $o.css({backgroundImage:'url("images/samples/'+$o.attr('previmage')+'")'});
                    },this));
                    
                },this));
                
                $('body').mouseup($.proxy(function(){
                    
                    //Reset Events and Draggables
                    $dragSample.remove();
                    this.isMouseDown = false;
                    $('body').unbind('mouseup');
                    $('body').unbind('mousemove');
                    this.$sampler.find('.board-cell').unbind('mouseenter');
                    this.$sampler.find('.board-cell').unbind('mouseleave');
                    this.$sampler.find('.board-cell').unbind('mouseup');
                },this));
                
            },this));
            
            this.$sampler.find('.board-item').click($.proxy(function(e){
                var board = this.boardList[$(e.currentTarget).parent().attr('boardid')];
                
                //Remove current
                this.$sampler.find('.board-item.current').removeClass('current');
                
                //Set current
                this.$sampler.find('#layout'+board.id+'.board-item').addClass('current');
                
                //Clear board layout
                
                
                //Create new layout
                this.setBoardLayout(board.cols, board.rows);
            },this));
        },
        destroyEvents: function(){},
        addSamples: function(sampleData){
            $.each(sampleData, $.proxy(function(index, samp){
                this.sampleList[samp.id] = samp;
                
                var sampleItem = '<li class="sample-item" sampleID="'+samp.id+'"><div class="sample-img"><img src="images/samples/'+samp.image+'"/></div><div class="sample-name">'+samp.name+'</div></li>';
                this.$sampler.find('.sample-list ul').append(sampleItem);
            },this));
            
            console.log(this.sampleList);
        },
        addBoards: function(boardData){
            $.each(boardData, $.proxy(function(index, board){
                this.boardList[board.id] = board;
                var current = '';
                if(board.hasOwnProperty('current')){
                    if(board.current.toLowerCase() === 'true'){
                        current = ' current';
                    }
                }
                
                var boardItem = '<li class="board-option" boardid="'+board.id+'"><div id="layout'+board.id+'" class="board-item '+current+'" style="background-image: url(images/'+board.icon+'-light.'+board.extension+')"></div></li>';
                if(board.icon != '') this.$sampleBoardOptions.find('ul').append(boardItem);
                
            },this));
        },
        setBoardLayout: function(row, col, w, h){
            //Container dimensions
            var conWidth = this.$sampler.find('.sample-container').width();
            var conHeight = this.$sampler.find('.sample-container').height();
            var topPadding = 80;
            var leftPadding = 120;
            var cellPadding = 20;
            
            var widthSize = Math.floor((conWidth-leftPadding) / col) - cellPadding;
            var heightSize = Math.floor((conHeight-topPadding) / row) - cellPadding;
            var size = widthSize;
            if(widthSize > heightSize) size = heightSize;
            var addMargin = (conWidth - leftPadding - ((size + cellPadding)*col))/2;
            if(addMargin < 0) addMargin = 0;
            
            var boardLayout = '<div class="board" style="margin-left: '+addMargin.toString()+'px">';
            for(var i = 0; i < row; i++){
                boardLayout += '<div class="board-row">';
                for(var j = 0; j < col; j++){
                    boardLayout += '<div class="board-cell" style="width: '+size.toString()+'px; height: '+size.toString()+'px;" previmage=""><p class="drag-text">Drag Sample Here</p></div>';
                }
                boardLayout += '</div>';
            }
            boardLayout += '</div>';
            this.$sampleBoard.html(boardLayout);
        },
        insideBoardCell: function(x, y){
            console.log('starting '+x.toString()+', '+y.toString());
            var $inside = false;
            this.$sampler.find('.board-cell').each($.proxy(function(i, el){
                var $el = $(el);
                var elX = $el.offset().left;
                var elY = $el.offset().top;
                var elXMax = elX + $el.width();
                var elYMax = elY + $el.height();
                console.log(elX.toString()+', '+elY.toString()+' and '+elXMax.toString()+', '+elYMax);
                if(x >= elX && x <= elXMax && y >= elY && y <= elYMax) $inside = $el;
            }));
            
            return $inside;
        }
    };
    
    $.fn.sampleconfig = $.fn.smpl = function (options) {
        if (this.length > 1) {
            var instances = [];

            this.each(function () {
                instances.push($(this).sample-config(options));
            });

            return instances;
        }

        // Return undefined if applied to non existing DOM element
        if (!$(this).length) {
            //Sample Configurator
            return;
        }

        return new SampleConfigurator(this, options);
  };
    
}(window.jQuery);
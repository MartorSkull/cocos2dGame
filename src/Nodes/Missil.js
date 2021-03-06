var Missil = cc.PhysicsSprite.extend({
    ctor:function(ally, position, aim, father, space){
        if(ally){
            this._super(res.playerLaser_img);
        }else{
            this._super(res.enemyLaser_img);
        };
        this.ally=ally;
        this.space=space;
        this.father=father;
        this.toDel=false;
        this.aim=aim;
        var scale = 0.38;
        this.counter=0;
        this.flag=true;

        this.contentSize = this.getContentSize();
        /////////////////////////////////////
        this.body = new cp.Body(1, cp.momentForBox(1, this.contentSize.width, this.contentSize.height));
        this.space.addBody(this.body);
        this.setBody(this.body);
        this.body.parent=this;
        this.attr({
            x:position.x,
            y:position.y,
            scale:scale
        });
        this.rotation=-90+this.getAngle();
        /////////////////////////////////////
        if(ally){
            var movement = new cc.moveTo(1, cc.p(this.aim.x,  this.aim.y));
        }else{
            var movement = new cc.moveTo(1, this.ext());
        };
        /////////////////////////////////////
        this.runAction(movement);
        /////////////////////////////////////
        this.scheduleUpdate();
    },
    /////////////////////////////////////////
    getAngle:function(){
        var num = null;
        if(this.aim.y>this.y){
            num = ((this.aim.y - this.y)/(this.x-this.aim.x));
        }else if(this.aim.y<this.y){
            num = -((this.y - this.aim.y)/(this.x-this.aim.x));
        }
        var angle= (Math.atan(num)*(180/Math.PI));
        return angle;
    },
    /////////////////////////////////////////
    ext:function(){
        var rel; 
        if(this.aim.y>this.y){
            rel = -((this.aim.y - this.y)/(this.x-this.aim.x));
        }else if(this.aim.y<this.y){
            rel = ((this.y - this.aim.y)/(this.x-this.aim.x));
        }
        var pos = cc.p(this.aim.x-200, this.aim.y-(200*rel));
        return pos;
    },
    /////////////////////////////////////////
    update:function(dt){
        if(this.toDel){
            this.remove();  
        };
        if(this.flag){
            this.counter+=dt;
            if(this.counter>=0.1){
                this.createShap();
                this.flag=false;
            }
        }
        if(this.ally){
            if(this.x>=size.width+80){
                this.remove();
            };
        }else{
            if(this.x<=-80){
                this.remove();
            };
        };
    },
    /////////////////////////////////////////
    remove:function(){
        this.body.removeShape(this.shape);
        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
        this.release();
        this.father.removeChild(this);
        this.unscheduleUpdate();
    },
    del:function(){
        this.toDel=true;
    },
    createShap:function(){
        this.shape = new cp.BoxShape(this.body,this.contentSize.width*this.scale, this.contentSize.height*this.scale);
        this.space.addShape(this.shape);
        if(this.ally){
            this.shape.setCollisionType(ColType.missilP);
            var movement = new cc.moveTo(1, cc.p(this.aim.x,  this.aim.y));
        }else{
            this.shape.setCollisionType(ColType.missilE);  
            var movement = new cc.moveTo(1, this.ext());
        };
    }
});
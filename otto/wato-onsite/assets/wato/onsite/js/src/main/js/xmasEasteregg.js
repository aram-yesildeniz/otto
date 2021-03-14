const FLAKES_COUNT = 24;

class XmasEasteregg {

    constructor(trackingApi) {
        this.keys = [88, 77, 65, 83]; // xmas
        this.index = 0;
        this.trackingApi = trackingApi;
    }

    init() {
        document.addEventListener("keydown", (e) => this.handler(e));
    }

    snow() {
        const style = document.createElement('style');
        style.innerHTML = `
.snowflake {
  color: #fff;
  font-size: 1em;
  font-family: Arial, sans-serif;
  text-shadow: 0 0 5px #000;
}
.snowman {
  font-size: 2em;
  color: red;
}
@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}
.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}
.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}
.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}
.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}
.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}
.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}
.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}
.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}
.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}
.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}
.snowflake:nth-of-type(10){left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}
.snowflake:nth-of-type(11){left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}

.snowflake:nth-of-type(12){left:85%;-webkit-animation-delay:0.1s,0.5s;animation-delay:0.1s,0.5s}
.snowflake:nth-of-type(13){left:95%;-webkit-animation-delay:1.7s,1s;animation-delay:1.7s,1s}
.snowflake:nth-of-type(14){left:87%;-webkit-animation-delay:6s,.2s;animation-delay:6s,.2s}
.snowflake:nth-of-type(15){left:55%;-webkit-animation-delay:3s,2s;animation-delay:3s,2s}
.snowflake:nth-of-type(16){left:75%;-webkit-animation-delay:2s,1.5s;animation-delay:2s,1.5s}
.snowflake:nth-of-type(17){left:65%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}
.snowflake:nth-of-type(18){left:22%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}
.snowflake:nth-of-type(19){left:45%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}
.snowflake:nth-of-type(20){left:35%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}
.snowflake:nth-of-type(21){left:82%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}
.snowflake:nth-of-type(22){left:15%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}
.snowflake:nth-of-type(23){left:7%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}
`;
        document.head.appendChild(style);

        const flakes = document.createElement('div');
        flakes.classList.add('snowflakes');
        for (let i = 0; i < FLAKES_COUNT; i++) {
            const aFlake = document.createElement('div');
            aFlake.textContent = i % 2 === 0 ? '❅' : '❆';
            aFlake.classList.add('snowflake');

            flakes.appendChild(aFlake);
        }
        document.body.appendChild(flakes);
    }

    handler(e) {
        const notInInputAndSelectField = document.activeElement
            && document.activeElement.tagName !== "INPUT"
            && document.activeElement.tagName !== "SELECT";
        const matchXmasKeySequence = e.keyCode === this.keys[this.index];

        if (notInInputAndSelectField && matchXmasKeySequence) {
            this.index += 1;
            if (this.index === this.keys.length) {
                document.removeEventListener("keydown", () => this.handler());
                this.snow();
                this.trackingApi.sendEventRequest({'wato_xmas': 'trigger'});
            }
        } else {
            this.index = 0;
        }
    }
}

export {XmasEasteregg}

import React, { PureComponent } from "react";
import pdfjs from "pdfjs-dist";
import PropTypes from "prop-types";

import styles from "./styles.css";

class PDFViewer extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            pdfDoc: null,
            pageRendering: false,
            pageNumPending: null,
            numPages: 1,
            pageNum: 1,
            scale: 1,
            rotate: null,
            counter: 0,
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        const { pageNum } = this.state;
        const loading = pdfjs.getDocument(this.props.url);
        loading.promise.then(pdf => {
            this.setState({ numPages: pdf._pdfInfo.numPages, pdfDoc: pdf }) 
            this.renderPage(pageNum) 
        })
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('nextState',nextState)
        if(nextState.pageNum !== this.state.pageNum) {
            this.renderPage(nextState.pageNum)
        }
       
    }

    

    renderPage = (num) => {
        const { pdfDoc, scale } = this.state;
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            const canvas = this.canvas.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
        });
        this.setState({ counter: num });
    };

    onPrevPage = () => {
        const { pageNum } = this.state
        if (pageNum <= 1) {
            return;
        }
        this.setState({ pageNum: pageNum - 1 });
    };

    onNextPage = () => {
        const { pageNum, numPages } = this.state
        if (pageNum >= numPages) {
            return;
        }
        this.setState({ pageNum: pageNum + 1 });
    };

    render() {
        const { url } = this.props;
        const { numPages, scale, rotate, counter, pageNum } = this.state;
        
        return (
            <div className={styles.container}>
                <div className={styles.info}>
                    PDFViewer component
                    <br />
                    url: {url} <br />
                    nombre de pages : {numPages} <br />
                    numero de la page : {pageNum} <br/>
                    scale: {scale} <br />
                    rotate: {rotate} <br />
                    counter: {counter}
                </div>
                <div>
                    <button onClick={this.onPrevPage}>prev</button>
                    <button onClick={this.onNextPage}>next</button>
                </div>
                <div>
                    <canvas ref={this.canvas}></canvas>
                </div>
            </div>
        );
    }
}

export default PDFViewer;

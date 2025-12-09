const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false });

    section_names.forEach((name) => {
        const container = document.getElementById(name + '-md');
        // 如果当前页面没有这个 section 的容器，直接跳过
        if (!container) {
            // 可选：调试用日志
            // console.log(`Skip section "${name}", no element with id "${name}-md" on this page.`);
            return;
        }

        fetch(content_dir + name + '.md')
           .then(response => response.text())
           .then(markdown => {
               const html = marked.parse(markdown);
               container.innerHTML = html;
            })
            .then(() => {
                // MathJax 重新排版
                if (window.MathJax && MathJax.typeset) {
                    MathJax.typeset();
                }
            })
             .catch(error => console.log(error));
    });

});

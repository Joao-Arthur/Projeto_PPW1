const MATRICULA = 110683;
let totalRecursos = -1;

function comentariosToDom(comentarios) {
    return appendElements(
        createDOMElement('div'),
        comentarios.map(comentario =>
            createDOMElement('p', { textContent: comentario.conteudo })
        )
    );
}

function topicoToDom(topico) {
    appendElementsContainer(
        document.getElementById('publicacoes'),
        createDOMElement('section'),
        [
            appendElements(createDOMElement('article'), [
                createDOMElement('p', { textContent: topico.conteudo }),
                createDOMElement('button', {
                    textContent: '\u00D7',
                    onClick: e =>
                        deletarTopico(e, topico.idUsuario, topico.index)
                })
            ]),
            appendElements(createDOMElement('form'), [
                createDOMElement('input', {
                    placeHolder: 'Adicione um comentário...'
                }),
                createDOMElement('button', {
                    textContent: 'enviar',
                    onClick: e =>
                        adicionarComentario(
                            e,
                            topico.idUsuario,
                            topico.idTopico
                        )
                })
            ]),
            topico.comentarios ? comentariosToDom(topico.comentarios) : null
        ].filter(e => e)
    );
}

const adicionarTopico = e => {
    e && e.preventDefault();
    const topicoDOM = document.getElementById('topico');
    const topicoValue = topicoDOM.value;
    topicoDOM.value = '';
    Topico(110683, topicoValue).then(() => {
        totalRecursos++;
        getRecurso(110683, totalRecursos)
            .then(topico => {
                topico.index = totalRecursos;
                return topico;
            })
            .then(topicoToDom);
    });
};

const adicionarComentario = (e, idUsuario, idRecurso) => {
    e && e.preventDefault();
    const comentarioDOM = e.target.parentNode.getElementsByTagName('input')[0];
    const comentarioValue = comentarioDOM.value;
    comentarioDOM.value = '';
    Comentario(idUsuario, idRecurso, 0, comentarioValue).then(() => {
        totalRecursos++;
        getRecurso(110683, totalRecursos)
            .then(comentario => {
                comentario.index = totalRecursos;
                return comentario;
            })
            .then(comentario => comentariosToDom([comentario]))
            .then(console.log);
    });
};

const deletarTopico = (e, idUsuario, idRecurso) => {
    const topicoDeletado = e.target.parentNode.parentNode;
    deleteRecurso(idUsuario, idRecurso).then(() => topicoDeletado.remove());
};

function listaRecursos() {
    getRecursos(110683).then(recursos => {
        recursos = recursos.map((recurso, index) => {
            recurso.index = index;
            return recurso;
        });
        totalRecursos = recursos.length - 1;
        const topicos = recursos.filter(
            recurso => recurso.tipoRecurso === tipos.TOPICO
        );
        const comentarios = recursos.filter(
            recurso => recurso.tipoRecurso === tipos.COMENTARIO
        );
        topicos
            .map(topico => {
                topico.comentarios = comentarios.filter(
                    comentario => comentario.idTopico === topico.idTopico
                );
                return topico;
            })
            .forEach(topicoToDom);
    });
}

listaRecursos();

document
    .getElementById('formulario')
    .addEventListener('submit', adicionarTopico);

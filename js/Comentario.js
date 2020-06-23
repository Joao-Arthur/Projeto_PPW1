function Comentario(idUsuario, idTopico, idComentarioPai, conteudo) {
    const comentario = Object.freeze({
        tipoRecurso: tipos.COMENTARIO,
        idTopico,
        idComentario: new Date().valueOf(),
        idComentarioPai,
        idUsuario,
        conteudo
    });

    return postRecurso(idUsuario, comentario);
}

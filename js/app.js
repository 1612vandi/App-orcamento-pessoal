class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    // Percorrendo todos atributos e valores da class despesa
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false
      }
    }
    return true
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  // metodo para gerar novo id
  getProximoId() {
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

  gravar(d) {
    // Acessando o recurso local storeg do browser / convertentendo objecto literal em notação JSON
    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(d))
    localStorage.setItem('id', id)


  }

  recuperarTodosRegistros() {
    let despesas = Array()
    let id = localStorage.getItem('id')

    //recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {

      //recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i))

      //existe a possibilidade de haver índices que foram pulados/removidos
      //nestes casos nós vamos pular esses índices
      if (despesa === null) {
        continue
      }
      despesa.id = i
      despesas.push(despesa)
    }

    return despesas
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()
    console.log(despesasFiltradas)

    // filtrando despesas 
    if (despesa.ano != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }

    if (despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }

    if (despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }

    if (despesa.tipo != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }

    if (despesa.descricao != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    return despesasFiltradas

  }

  remover(id) {
    localStorage.removeItem(id)
  }

}

let bd = new Bd()

function cadastrarDespesa() {
  // Recuperando dados inseridos no formulario de cadastro
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if (despesa.validarDados()) {
    bd.gravar(despesa)

    //Criando elementos html
    document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modal_titulo_div').className = 'modal-header text-success'
    document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('modal_btn').innerHTML = 'Voltar'
    document.getElementById('modal_btn').className = 'btn btn-success'

    //dialog de sucesso
    $('#modalRegistraDespesa').modal('show')

    // Limpando os campos do formulario após registro
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''
  } else {
    //Criando elementos html
    document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
    document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
    document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
    document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
    document.getElementById('modal_btn').className = 'btn btn-danger'

    //dialog de erro
    $('#modalRegistraDespesa').modal('show')
  }
}

function carregaListaDespesas(despesas = Array(), filter = false) {
  if (despesas.length == 0 && filter == false) {
    despesas = bd.recuperarTodosRegistros()
  }

  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''

  // percorrendo o array despesas, listando cada despesa de forma dinamica
  despesas.forEach(function (d) {
    // criando linhas(tr)
    let linha = listaDespesas.insertRow()
    // criando colunas(td)
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
    //Ajustando o tipo
    switch (d.tipo) {
      case '1': d.tipo = 'Alimentação'
        break;
      case '2': d.tipo = 'Educação'
        break;
      case '1': d.tipo = 'Lazer'
        break;
      case '1': d.tipo = 'Saúde'
        break;
      case '1': d.tipo = 'Transporte'
        break;
    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //Criar o botão de exclusão
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fa fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function () {
      let id = this.id.replace('id_despesa_', '')
      //alert(id)
      bd.remover(id)
      window.location.reload()
    }
    linha.insertCell(4).append(btn)
  })
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
  let despesas = bd.pesquisar(despesa)

  // Actualizando pesquisa com os resultados da busca
  this.carregaListaDespesas(despesas, true)
}




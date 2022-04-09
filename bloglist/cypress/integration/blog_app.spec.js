describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Anton Barron',
      username: 'baron_12',
      password: 'test123'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('LOGIN')
  })

  it('login form is shown', function () {
    cy.contains('Username')
    cy.contains('Password')
  })

  it('login form can be opened', function () {
    cy.contains('LOGIN').click()
  })

  it('succeeds with correct credentials', function () {
    cy.contains('LOGIN').click()
    cy.get('#username').type('baron_12')
    cy.get('#password').type('test123')
    cy.get('#login-button').click()

    cy.contains('Anton Barron is logged in')
  })

  it('fails with wrong credentials', function () {
    cy.get('#username').type('Unknown')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(216, 0, 12)')

    cy.get('html').should('not.contain', 'Anton Barron is logged in')
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'baron_12', password: 'test123' })
    })

    it('A blog can be created', function () {
      cy.contains('Create a new blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('Test url')
      cy.contains('CREATE').click()
      cy.contains('Test title')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url', likes: 1 })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url', likes: 2 })
        cy.createBlog({ title: 'third blog', author: 'third author', url: 'third url', likes: 3 })
        cy.createBlog({ title: 'forth blog', author: 'forth author', url: 'forth url', likes: 4 })
      })

      it('A blog can be liked', function () {
        cy.contains('second blog').parent().find('button').click()
        cy.contains('likes 2')
        cy.get('#like-button').click()
        cy.contains('likes 3')
      })

      it('A blog can be removed by the user who created it', function () {
        cy.contains('third blog').parent().find('button').click()
        cy.get('#delete-button').click()
        cy.get('html').should('not.contain', 'third blog')
      })

      it.only('Blogs are ordered depending on their likes', function () {
        cy.get('[data-cy="blog"]').then(($blog) => {
          expect($blog).to.have.length(4)

          // const firstInList = cy.contains('first blog').first()
          // const secondInList = cy.contains('second blog').next()
          // const thirdInList = cy.contains('third blog').next()
          // const forthInList = cy.contains('forth blog').next()

          // expect($blog.first(firstInList).next(secondInList).next())
        })

        // cy.get('[data-cy="blog"]').within(($blog) => {
        //   cy.get('blog:first').should('have.text', 'first blog')
        // cy.get('[data-test-id="blog"]:last').should('have.text', 'forth blog')
        // })
      })
    })
  })
})

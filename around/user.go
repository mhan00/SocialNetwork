package main

import (
	"fmt"
	"reflect"

	"github.com/olivere/elastic/v7"
)

const (
	USER_INDEX = "user"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Age      int64  `json:"age"`
	Gender   string `json:"gender"`
}

func checkUser(username, password string) (bool, error) {
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("username", username))
	query.Must(elastic.NewTermQuery("password", password))

	searchResult, err := readFromES(query, USER_INDEX)
	if err != nil {
		return false, err
	}
	var ptype User
	for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
		if u, ok := item.(User); ok {
			if u.Password == password {
				fmt.Printf("Login as %s\n", username)
				return true, nil
			}
		}
	}
	return false, nil
}

func addUser(user *User) (bool, error) { // check whether the create user existed or not
	query := elastic.NewTermQuery("username", user.Username)
	SearchResult, err := readFromES(query, USER_INDEX)
	if err != nil {
		return false, err
	}
	if SearchResult.TotalHits() > 0 {
		return false, err
	}
	err = saveToES(user, USER_INDEX, user.Username)
	if err != nil {
		return false, err
	}
	return true, nil
}

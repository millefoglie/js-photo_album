package com.github.millefoglie.visitors;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import com.github.millefoglie.entities.Photo;
import com.mysema.query.types.expr.BooleanExpression;
import com.mysema.query.types.path.PathBuilder;

import cz.jirutka.rsql.parser.ast.AndNode;
import cz.jirutka.rsql.parser.ast.ComparisonNode;
import cz.jirutka.rsql.parser.ast.Node;
import cz.jirutka.rsql.parser.ast.OrNode;
import cz.jirutka.rsql.parser.ast.RSQLVisitor;

public class PhotoUrlParserVisitor 
implements RSQLVisitor<BooleanExpression, PathBuilder<Photo>> {

    @Override
    public BooleanExpression visit(AndNode node, PathBuilder<Photo> param) {
	List<Node> children = node.getChildren();

	BooleanExpression left = children.get(0).accept(this, param);
	BooleanExpression right = children.get(1).accept(this, param);

	return left.and(right);
    }

    @Override
    public BooleanExpression visit(OrNode node, PathBuilder<Photo> param) {
	List<Node> children = node.getChildren();

	BooleanExpression left = children.get(0).accept(this, param);
	BooleanExpression right = children.get(1).accept(this, param);

	return left.or(right);
    }

    @Override
    public BooleanExpression visit(ComparisonNode node,
	    PathBuilder<Photo> param) {
	String op = node.getOperator().getSymbol();
	String selector = node.getSelector();
	String value = node.getArguments().get(0);
	
	switch (op) {
	case "==":
	    switch (selector) {
	    case "author":
		PathBuilder<Object> pb = param.get("author");
		return pb.get("username", java.lang.String.class).eq(value); 
	    case "title":
		return param.getComparable(selector, java.lang.String.class).eq(value);
	    case "likesCount":
		return param.getComparable(selector, java.lang.Integer.class).eq(Integer.parseInt(value));
	    default:
		return param.isNull();
	    }
	case "=gt=":
	    switch (selector) {
	    case "addedOn":
		Calendar cal = new GregorianCalendar();
		
		cal.setTimeInMillis(Long.parseLong(value));
		return param.getComparable(selector, java.util.Calendar.class).gt(cal);
	    default:
		return param.isNull();
	    }
	case "=lt=":
	default:
	    return param.isNull();
	}
    }

}

'''from rest_framework import viewsets
from .models import Category, ProductType, Series, StorageItem, UserRequest
from .serializers import *

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer

class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

class StorageItemViewSet(viewsets.ModelViewSet):
    queryset = StorageItem.objects.all()
    serializer_class = StorageItemSerializer

class UserRequestViewSet(viewsets.ModelViewSet):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer
'''
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Type, Series, ProductField, Stock, Module
from .serializers import CategorySerializer, TypeSerializer, SeriesSerializer, ProductFieldSerializer, StockSerializer
import importlib

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class TypeListView(APIView):
    def get(self, request):
        category_id = request.GET.get("category_id")
        types = Type.objects.filter(category_id=category_id)
        serializer = TypeSerializer(types, many=True)
        return Response(serializer.data)


class SeriesListView(APIView):
    def get(self, request):
        type_id = request.GET.get("type_id")
        series = Series.objects.filter(type_id=type_id)
        serializer = SeriesSerializer(series, many=True)
        return Response(serializer.data)


class ProductFieldListView(APIView):
    def get(self, request):
        series_id = request.GET.get("series_id")
        fields = ProductField.objects.filter(series_id=series_id)
        serializer = ProductFieldSerializer(fields, many=True)
        return Response(serializer.data)


class StockListView(APIView):
    def get(self, request):
        stock = Stock.objects.all()
        serializer = StockSerializer(stock, many=True)
        return Response(serializer.data)


class CalculateCostView(APIView):
    def post(self, request):
        series_id = request.data.get("series_id")
        data = request.data.get("data")
        try:
            module = Module.objects.get(series_id=series_id)
            module_path = module.module_path
            calculate_module = importlib.import_module(module_path)
            cost = calculate_module.calculate_cost(data)
            return Response({"cost": cost})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({"success": True, "message": "Login successful"})
        else:
            return JsonResponse({"success": False, "message": "Invalid credentials"})
    return JsonResponse({"success": False, "message": "Invalid request method"})